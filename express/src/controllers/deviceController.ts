//Importando tipos relativos ao express
import { Request, Response } from "express";
//Importando DTOS
import {
  CreateDeviceDTO,
  EditDeviceDTO,
  DeviceIDParameter,
} from "./../dtos/device";
//Importando enum de status code
import StatusCodes from "../enums/StatusCodes";
//Importando services do dispositivo
import deviceServices from "../services/deviceServices";

//Cria um novo dispositivo
async function createDevice(
  req: Request<{}, {}, CreateDeviceDTO>,
  res: Response
) {
  try {
    const deviceDTO: CreateDeviceDTO = { ...req.body };
    const newDevice = await deviceServices.createDevice(deviceDTO);
    res
      .status(StatusCodes.CREATED)
      .json({ status: "success", data: newDevice });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_ERROR).json({
      status: "error",
      message: err instanceof Error ? err.message : err,
    });
  }
}

//Obtém todos os dispositivos
//Typescripted
async function getAllDevices(_req: Request, res: Response) {
  try {
    const data = await deviceServices.getAllDevices();
    res.status(StatusCodes.OK).json({ status: "success", data });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_ERROR).json({
      status: "error",
      message: err instanceof Error ? err.message : err,
    });
  }
}

//Edita um dispositivo baseado em seu id (Método PATCH)
//Typescripted
async function editDevice(
  req: Request<DeviceIDParameter, {}, EditDeviceDTO>,
  res: Response
) {
  try {
    const id = Number(req.params.id);
    const deviceDTO: EditDeviceDTO = { ...req.body };
    //Service
    const updatedDevice = await deviceServices.editDevice(deviceDTO, id);
    res.status(StatusCodes.OK).json({ status: "success", updatedDevice });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_ERROR).json({
      status: "error",
      message: err instanceof Error ? err.message : err,
    });
  }
}

//Typescripted
async function deleteDevice(req: Request<DeviceIDParameter>, res: Response) {
  try {
    const id = Number(req.params.id);
    await deviceServices.deleteDevice(id);
    res
      .status(StatusCodes.OK)
      .json({ status: "success", message: "Dispositivo deletado." });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_ERROR).json({
      status: "success",
      message: err instanceof Error ? err.message : err,
    });
  }
}

//Typescripted
async function getDeviceById(req: Request<DeviceIDParameter>, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await deviceServices.getDeviceById(id);
    res.status(StatusCodes.OK).json({ status: "success", data: data });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_ERROR).json({
      status: "success",
      message: err instanceof Error ? err.message : err,
    });
  }
}

export default {
  createDevice,
  editDevice,
  getAllDevices,
  getDeviceById,
  deleteDevice,
};
