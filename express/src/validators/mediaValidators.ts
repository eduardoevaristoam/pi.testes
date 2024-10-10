import { Request, Response, NextFunction } from "express";
import { mediaIDParameter } from "./../dtos/media";
//Importando enum de status code
import StatusCodes from "../enums/StatusCodes";
//Importando zod
import { z } from "zod";

//Media id parameter object
async function validateMediaIDParameter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.params = await mediaIDParameter.parseAsync(req.params);
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
  validateMediaIDParameter,
};
