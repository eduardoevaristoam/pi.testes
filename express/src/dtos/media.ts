//Importando zod
import { z } from "zod";
//Importando enum de mensagens de erro
import ErrorMessages from "../enums/ErrorMessages";

export const createMediaBody = z.object({
  uuid: z.string().uuid(),
  content: z.string().url(),
  mimetype: z.string(),
  idPlaylist: z.number().min(0),
});
export type CreateMediaDTO = z.infer<typeof createMediaBody>;

//Media ID Parameter
export const mediaIDParameter = z.object({
  uuid: z.string().uuid(ErrorMessages.UUID),
});
//Inferring DTO from validator
export type MediaIDParameter = z.infer<typeof mediaIDParameter>;
