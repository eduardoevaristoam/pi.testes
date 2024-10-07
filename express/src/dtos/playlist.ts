//Importando zod
import { z } from "zod";
//Importando enum de mensagens de erro
import ErrorMessages from "../enums/ErrorMessages";

//Create Playlist
export const createPlaylistBody = z.object({
  nome: z
    .string({ message: ErrorMessages.Nome })
    .min(1, ErrorMessages.NomeMinLength),
  intervalo: z.coerce
    .number({ message: ErrorMessages.Intervalo })
    .min(1, ErrorMessages.IntervaloMinLength),
});
export type CreatePlaylistDTO = z.infer<typeof createPlaylistBody>;

//Edit Playlist
export const editPlaylistBody = z.object({
  nome: z.string().min(1, ErrorMessages.NomeMinLength).optional(),
  intervalo: z.coerce
    .number()
    .min(1, ErrorMessages.IntervaloMinLength)
    .optional(),
  idPlaylist: z.coerce
    .number()
    .min(0, ErrorMessages.IdPlaylistMinLength)
    .optional(),
});
export type EditPlaylistDTO = z.infer<typeof editPlaylistBody>;

//Playlist ID Parameter
export const playlistIDParameter = z.object({
  id: z.coerce
    .string({ message: ErrorMessages.IdParameter })
    .min(0, ErrorMessages.IdPlaylistMinLength),
});
export type PlaylistIDParameter = z.infer<typeof playlistIDParameter>;

//Media query
export const playlistMediaQuery = z.object({
  page: z.coerce.number().min(1, ErrorMessages.MediaQuery).optional(),
  limit: z.coerce.number().min(1, ErrorMessages.MediaQuery).optional(),
});
//Inferring DTO from validator
export type PlaylistMediaQuery = z.infer<typeof playlistMediaQuery>;
