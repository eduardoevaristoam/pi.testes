//Importando tipos relativos ao express
import { Request, Response } from "express";
//Importando prisma
import { PrismaClient } from "@prisma/client";
const { playlist } = new PrismaClient();
//Importando serviços de playlist
import playlistServices from "../services/playlistServices";
//Importando tipos/DTOS
import {
  CreatePlaylistDTO,
  EditPlaylistDTO,
  PlaylistIDParameter,
} from "../dtos/playlist";
//Importando enum de status code
import StatusCodes from "../enums/StatusCodes";

//Cria uma nova playlist
async function createPlaylist(
  req: Request<{}, {}, CreatePlaylistDTO>,
  res: Response
) {
  try {
    console.log("passou aq");
    //const playlistDTO = playlistServices.validateCreatePlaylistBody({...req.body});
    //Just to avoid passing req.body directly
    const playlistDTO: CreatePlaylistDTO = { ...req.body };
    const newPlaylist = await playlistServices.createPlaylist(playlistDTO);
    res
      .status(StatusCodes.CREATED)
      .json({ status: "success", data: newPlaylist });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_ERROR)
      .json({ status: "error", message: err });
  }
}

//Obtém todas as playlists
async function getAllPlaylists(req: Request, res: Response) {
  try {
    const data = await playlistServices.getAllPlaylists();
    res.status(StatusCodes.OK).json({ status: "success", data: data });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_ERROR)
      .json({ status: "error", message: err });
  }
}

//Edita uma playlist baseada em seu id
//Tratar retorno
async function editPlaylist(
  req: Request<PlaylistIDParameter, {}, EditPlaylistDTO>,
  res: Response
): Promise<any | void | Response<any, Record<string, any>>> {
  try {
    const id = Number(req.params.id);
    //Check if playlist exists playlistServices.getPlaylist...
    const playlistToEdit = await playlistServices.getPlaylistWithoutMediaById(
      id
    );

    if (!playlistToEdit) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "fail",
        message: "Nenhuma playlist com tal ID encontrada.",
      });
    }

    //Just to avoid passing in req.body directly
    const playlistDTO: EditPlaylistDTO = { ...req.body };
    const updatedPlaylist = await playlist.update({
      where: { id },
      data: playlistDTO,
    });
    res
      .status(StatusCodes.OK)
      .json({ status: "success", data: updatedPlaylist });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_ERROR).json({
      status: "error",
      message: err instanceof Error ? err.message : err,
    });
  }
}

//Deleta uma playlist baseada em seu id
async function deletePlaylist(
  req: Request<PlaylistIDParameter>,
  res: Response
) {
  try {
    //get playlist
    //filter all that's not text
    //delete playlist - if failed, media's still in the bucket, if success, delete media in bucket
    //delete media in bucket
    const id = Number(req.params.id);
    await playlistServices.deletePlaylist(id);
    res
      .status(StatusCodes.OK)
      .json({ status: "success", message: "Playlist deletada!" });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_ERROR).json({
      status: "error",
      message: err instanceof Error ? err.message : err,
    });
  }
}

//Usado na página do dispositivo, após certificar-se de que, existe uma playlist associada a este
async function getPlaylistById(
  req: Request<PlaylistIDParameter>,
  res: Response
) {
  try {
    let data;
    const id = Number(req.params.id);

    //Caso tenhamos uma query media=true na URL
    if (req.query?.media === "true") {
      data = await playlistServices.getPlaylistWithMediaById(id);
    } else {
      //Caso NÃO tenhamos uma query media na URL
      data = await playlistServices.getPlaylistWithoutMediaById(id);
    }

    res.status(StatusCodes.OK).json({ status: "success", data: data });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_ERROR).json({
      status: "error",
      message: err instanceof Error ? err.message : err,
    });
  }
}

export default {
  createPlaylist,
  editPlaylist,
  getAllPlaylists,
  getPlaylistById,
  deletePlaylist,
};
