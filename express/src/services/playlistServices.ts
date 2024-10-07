import type { CreatePlaylistDTO } from "../dtos/playlist";
import { PrismaClient } from "@prisma/client";
const { playlist } = new PrismaClient();

//Criação de Data Transfer Object de Create Playlist
//Used Zod
// function validateCreatePlaylistBody(body): createPlaylistDTO {
//     //Falta validar
//     const newPlaylistDTO: createPlaylistDTO = {
//         nome: body.nome,
//         intervalo: Number(body.intervalo)
//     }
//     return newPlaylistDTO;
// }

//Service de criação de playlist
async function createPlaylist(playlistDTO: CreatePlaylistDTO) {
  try {
    const newPlaylist = await playlist.create({ data: playlistDTO });
    return newPlaylist;
  } catch (err) {
    throw new Error("Erro ao criar playlist.");
  }
}

async function getAllPlaylists() {
  try {
    const data = await playlist.findMany({
      orderBy: { id: "asc" },
      include: { _count: { select: { Midia: true } } },
    });
    return data;
  } catch (err) {
    throw new Error("Erro ao obter playlists.");
  }
}

async function getPlaylistWithMediaById(id: number) {
  try {
    const data = await playlist.findUnique({
      where: { id },
      include: { Midia: true },
    });
    return data;
  } catch (err) {
    throw new Error("Erro ao obter playlist.");
  }
}

async function getPlaylistWithoutMediaById(id: number) {
  try {
    const data = await playlist.findUnique({
      where: { id },
    });
    return data;
  } catch (err) {
    throw new Error("Erro ao obter playlist.");
  }
}

async function deletePlaylist(id: number) {
  try {
    await playlist.delete({ where: { id } });
  } catch (err) {
    throw new Error("Erro ao obter playlist.");
  }
}

export default {
  createPlaylist,
  getAllPlaylists,
  getPlaylistWithMediaById,
  getPlaylistWithoutMediaById,
  deletePlaylist,
};
