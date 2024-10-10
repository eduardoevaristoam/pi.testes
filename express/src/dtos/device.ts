//Importando zod
import { z } from "zod";
//Importando enum de mensagens de erro
import ErrorMessages from "../enums/ErrorMessages";

//Create Device
export const createDeviceBody = z.object({
  nome: z
    .string({ message: ErrorMessages.Nome })
    .min(1, ErrorMessages.NomeMinLength),
});
//Inferindo DTO/Tipo através do schema pra validações do Zod
export type CreateDeviceDTO = z.infer<typeof createDeviceBody>;

//Edit Device
export const editDeviceBody = z.object({
  nome: z.string().min(1, ErrorMessages.NomeMinLength).optional(),
  idPlaylist: z.coerce
    .number()
    .min(0, ErrorMessages.IdPlaylistMinLength)
    .optional(),
});
//Inferindo DTO/Tipo através do schema pra validações do Zod
export type EditDeviceDTO = z.infer<typeof editDeviceBody>;

//Device ID Parameter
export const deviceIDParameter = z.object({
  id: z.coerce
    .string({ message: ErrorMessages.IdParameter })
    .min(0, ErrorMessages.IdPlaylistMinLength),
});
//Inferindo DTO/Tipo através do schema pra validações do Zod
export type DeviceIDParameter = z.infer<typeof deviceIDParameter>;
