import { Request, Response, NextFunction } from "express";
//Importando schemas do Zod
import {
  //Zod schemas
  createDeviceBody,
  editDeviceBody,
  deviceIDParameter,
  //Types
  DeviceIDParameter,
} from "./../dtos/device";
//Importando enum de status code
import StatusCodes from "../enums/StatusCodes";
//Importando zod
import { z } from "zod";

//Create Device
async function validateCreateDeviceBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //Validação
    req.body = await createDeviceBody.parseAsync(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "fail",
        message: err.issues[0].message,
      });
    }
  }
}

//Edit Device
async function validateEditDeviceBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //Validação
    req.body = await editDeviceBody.parseAsync(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "fail",
        message: err.issues[0].message,
      });
    }
  }
}

//Device id parameter object
async function validateDeviceIDParameter(
  req: Request<DeviceIDParameter>, //Checar
  res: Response,
  next: NextFunction
) {
  try {
    req.params = await deviceIDParameter.parseAsync(req.params);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "fail",
        message: err.issues[0].message,
      });
    }
  }
}

export default {
  validateCreateDeviceBody,
  validateDeviceIDParameter,
  validateEditDeviceBody,
};
