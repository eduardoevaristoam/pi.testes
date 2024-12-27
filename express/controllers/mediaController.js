//const database = require("./../database");
const client = require("../S3Client");
const crypto = require("crypto");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { PrismaClient } = require("@prisma/client");
const { midia } = new PrismaClient();

//Obtém todas as mídias
exports.getAllMedia = async (req, res) => {
  try {
    const data = await midia.findMany();
    res.status(200).json({ status: "success", data: data });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

//Cria uma entrada no banco de dados (caso todas os middlewares anteriores sejam favoráveis)
exports.postMedia = async (req, res) => {
  if (req.isText) {
    try {
      const mediaDataObject = {
        uuid: crypto.randomUUID(),
        content: req.body.text,
        mimetype: "text/plain",
        idPlaylist: Number(req.params.id),
      };
      const data = await midia.create({ data: mediaDataObject });
      return res.status(201).json({ status: "success", data: data });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  }

  try {
    //Objeto de mídia para ser incluído
    const mediaDataObject = {
      uuid: req.uuid,
      content: req.bucketURL,
      mimetype: req.mimetype,
      idPlaylist: Number(req.params.id),
    };

    const data = await midia.create({ data: mediaDataObject });
    res.status(201).json({ status: "success", data: data });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

//Obtem mídia por playlist
//Usada no gerenciamento das playlists, pode ser paginada com a query page=x e limit=x
exports.getMediaByPlaylist = async (req, res) => {
  const idPlaylist = Number(req.params?.id) || null;

  //Isso provavelmente deverá estar em um middleware prévio
  if (!idPlaylist)
    return res
      .status(400)
      .json({ status: "fail", message: "Por favor, forneça um ID." });

  try {
    let data;

    //Caso tenhamos uma query page na URL
    if (req.query.page) {
      const take = Number(req.query?.limit) || 5;
      //const skip = req.query.page * take - take;
      const skip = (req.query.page - 1) * take;
      data = await midia.findMany({ where: { idPlaylist }, skip, take });
    } else {
      //Caso NÃO tenhamos uma query page na URL
      data = await midia.findMany({ where: { idPlaylist } });
    }

    const count = await midia.count({ where: { idPlaylist } });
    res.status(200).json({
      status: "success",
      totalResults: count,
      resultsPerPage: Number(req.query?.limit) || req.query?.page ? "5" : "all",
      data: data,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

//Obtem mídia por seu id
exports.getMediaById = async (req, res) => {
  const { uuid } = req.params;
  if (!uuid)
    return res
      .status(400)
      .json({ status: "fail", message: "Por favor, forneça um UUID." });

  try {
    //Parametrizando query de SQL
    const data = await midia.findUnique({ where: { uuid } });
    //Caso a mídia não seja encontrada
    if (!data) {
      return res.status(404).json({
        status: "fail",
        message: "Nenhuma mídia com tal ID encontrada",
      });
    }
    //Caso a mídia for encontrada
    res.status(200).json({ status: "success", data: data });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

//Middleware que checa se existe, de fato, um arquivo no objeto de request (usado com método POST)
exports.checkBody = (req, res, next) => {
  if (!req?.file && !req.body?.text) {
    return res
      .status(400)
      .json({ status: "fail", message: "Nenhuma mídia foi enviada." });
  }
  if (req.body?.text) req.isText = true;
  next();
};

//Middleware que checa se o mimetype do arquivo enviado é aceito (usado com método POST)
exports.checkMimeType = (req, res, next) => {
  if (req.isText) return next();

  console.log(req.file);
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
  const mimetype = req.file.mimetype;
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
};

//Middleware que envia mídias pro bucket
exports.putNewMedia = async (req, res, next) => {
  if (req.isText) return next();
  try {
    //Gerando identificador único
    const UUID = crypto.randomUUID();
    //Comando pra enviar pro cliente S3
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: UUID,
      Body: req.file.buffer,
      ContentType: req.mimetype,
    });
    await client.send(uploadCommand);
    //Setando a URL e UUID do arquivo no bucket no objeto request para persistir no banco de dados
    req.bucketURL = `https://${process.env.PROJECT_ID}.supabase.co/storage/v1/object/public/${process.env.BUCKET_NAME}/${UUID}`;
    req.uuid = UUID;
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
  next();
};

//Deleta uma mídia no bucket antes de deletá-la no banco de dados
exports.deleteMediaBucket = async (req, res, next) => {
  if (req.headers.istext === "true") return next();

  const UUID = req.params.uuid;
  try {
    //Comando pra enviar pro cliente S3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: UUID,
    });
    await client.send(deleteCommand);
    next();
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

exports.deleteMedia = async (req, res) => {
  const UUID = Number(req.params.uuid);
  try {
    await midia.delete({ where: { UUID } });
    res.status(200).json({ status: "success", message: "Content deleted" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
