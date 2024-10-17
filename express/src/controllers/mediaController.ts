//Imporando tipos relativos ao Express
import { NextFunction, Request, Response } from "express";
//Importando Prisma
import { PrismaClient } from "@prisma/client";
const { midia } = new PrismaClient();
//Importando services usados
import mediaServices from "../services/mediaServices";
//Importando DTOS
import { MediaIDParameter, CreateMediaDTO } from "../dtos/media";
import { PlaylistIDParameter, PlaylistMediaQuery } from "../dtos/playlist";
//Importando enum de status code
import StatusCodes from "../enums/StatusCodes";
import playlistServices from "../services/playlistServices";

const acceptedMimeTypes = new Map([
  // Images
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/gif", "gif"],
  ["image/bmp", "bmp"],
  ["image/webp", "webp"],
  // Videos
  ["video/mp4", "mp4"],
  ["video/mpeg", "mpeg"],
  ["video/webm", "webm"],
  ["video/x-msvideo", "avi"],
]);

//Obtém todas as mídias
async function getAllMedia(req: Request, res: Response) {
  try {
    const data = await mediaServices.getAllMedia();
    res.status(StatusCodes.OK).json({ status: "success", data: data });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_ERROR).json({
      status: "error",
      message: err instanceof Error ? err.message : err,
    });
  }
}

//Cria uma entrada no banco de dados (caso todas os middlewares anteriores sejam favoráveis)
//Tratar Promise<any>
async function postMedia(
  req: Request<PlaylistIDParameter>,
  res: Response
): Promise<any> {
  //ID da playlist
  const id = Number(req.params.id);
  const isText = req.isText === true;

  try {
    //Objeto de mídia para ser incluído
    const mediaDTO: CreateMediaDTO = await mediaServices.createMediaDTO(
      req,
      id,
      isText
    );

    const data = await midia.create({ data: mediaDTO });
    await playlistServices.updatePlaylistUpdateAt(id);
    res.status(StatusCodes.CREATED).json({ status: "success", data: data });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_ERROR).json({
      status: "error",
      message: err instanceof Error ? err.message : err,
    });
  }
}

//Think this should be in the playlist controllers and then the logic in playlistServices a a bit in mediaServices
//Obtem mídia por playlist
//Usada no gerenciamento das playlists, pode ser paginada com a query page=x e limit=x
//Tratar Promise<any>
async function getMediaByPlaylist(
  req: Request<PlaylistIDParameter, {}, {}, PlaylistMediaQuery>,
  res: Response
): Promise<any> {
  try {
    const idPlaylist = Number(req.params.id);
    const query: PlaylistMediaQuery = { ...req.query };
    const { data, count } = await mediaServices.getMediaByPlaylistId(
      idPlaylist,
      query
    );
    res.status(StatusCodes.OK).json({
      status: "success",
      totalResults: count,
      //Wrap the ternary operator in parenthesis, otherwise, it'll always be evaluated, even when limit is truthy
      resultsPerPage:
        Number(req.query?.limit) || (req.query?.page ? "5" : "all"),
      data: data,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_ERROR).json({
      status: "error",
      message: err instanceof Error ? err.message : err,
    });
  }
}

//Obtem mídia por seu id
//Tratar retorno
async function getMediaById(
  req: Request<MediaIDParameter>,
  res: Response
): Promise<any | void | Response<any, Record<string, any>>> {
  try {
    const uuid = req.params.uuid;
    const data = await mediaServices.getMediaByUUID(uuid);
    //Caso a mídia não seja encontrada
    if (!data) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        message: "Nenhuma mídia com tal ID encontrada",
      });
    }
    //Caso a mídia for encontrada
    res.status(StatusCodes.OK).json({ status: "success", data: data });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_ERROR).json({
      status: "error",
      message: err instanceof Error ? err.message : err,
    });
  }
}

//Middleware que checa se existe, de fato, um arquivo no objeto de request (usado com método POST)
//Tratar o any depois
function checkBody(req: Request, res: Response, next: NextFunction): any {
  //Aqui ainda não é certo que esses objetos existem, por isso o Optional Chaining (?.) pra evitar erros
  if (!req?.file && !req.body?.text) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "fail", message: "Nenhuma mídia foi enviada." });
  }
  //Definindo se é texto ou não
  if (req.body?.text) req.isText = true;
  next();
}

//Middleware que checa se o mimetype do arquivo enviado é aceito (usado com método POST)
//Tratar o any depois
function checkMimeType(req: Request, res: Response, next: NextFunction): any {
  if (req?.isText) return next();

  console.log(req.file);

  //Aqui há certeza que req.file existe, se não, já teria retornado no next(), por isso o uso de Non-Null Assertion (!)
  const mimetype = req.file!.mimetype;
  if (acceptedMimeTypes.get(mimetype)) {
    //Se for aceito, incluiremos essa informação no objeto de request para usar posteriormente
    req.mimetype = mimetype;
  } else {
    return res
      .status(400)
      .json({ status: "fail", message: "Formato de arquivo não aceito" });
  }
  //console.log(req);
  next();
}

//Middleware que envia mídias pro bucket
async function putNewMedia(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  if (req?.isText) return next();

  try {
    const uuid = await mediaServices.putMediaInBucket(
      //Nesse ponto, temos certeza que os objetos NÃO são null/undefined, por isso (!)
      req.file!.buffer,
      req.mimetype!
    );
    //Setando a URL e UUID do arquivo no bucket no objeto request para persistir no banco de dados
    req.bucketURL = `https://${process.env.PROJECT_ID}.supabase.co/storage/v1/object/public/${process.env.BUCKET_NAME}/${uuid}`;
    req.uuid = uuid;
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err instanceof Error ? err.message : err,
    });
  }
  next();
}

//Deleta uma mídia no bucket antes de deletá-la no banco de dados
async function deleteMediaBucket(
  req: Request<MediaIDParameter>,
  res: Response,
  next: NextFunction
) {
  //Se mídia é do tipo texto, retorna next()
  if (req.headers.istext === "true") return next();

  try {
    const uuid = req.params.uuid;
    await mediaServices.deleteMediaFromBucket(uuid);
    next();
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err instanceof Error ? err.message : err,
    });
  }
}

//Deleta uma mídia do banco de dados, usada depois de deleteMediaBucket
async function deleteMedia(req: Request<MediaIDParameter>, res: Response) {
  const uuid = req.params.uuid;
  try {
    await mediaServices.deleteMedia(uuid);
    res.status(200).json({ status: "success", message: "Mídia deletada." });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err instanceof Error ? err.message : err,
    });
  }
}

export default {
  getAllMedia,
  getMediaById,
  getMediaByPlaylist,
  postMedia,
  deleteMedia,
  deleteMediaBucket,
  checkBody,
  checkMimeType,
  putNewMedia,
};
