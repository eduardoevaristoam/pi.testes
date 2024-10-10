import { z } from "zod";
//Importando tipos do Express
import { NextFunction, Request, Response } from "express";
//Importando schemas do Zod
import {
  //Zod schemas
  createPlaylistBody,
  editPlaylistBody,
  playlistIDParameter,
  playlistMediaQuery,
  //Types
  PlaylistIDParameter,
  PlaylistMediaQuery,
} from "../dtos/playlist";
//Importando enum de status code
import StatusCodes from "../enums/StatusCodes";

//Create Playlist
async function validateCreatePlaylistBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.body);
    req.body = await createPlaylistBody.parseAsync(req.body);
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

//Edit Playlist
async function validateEditPlaylistBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //Atribuindo a req.body pois podem haver type-coercing e para ter certeza que req.body é complacente com seu DTO (que é inferido a partir do schema zod)
    req.body = await editPlaylistBody.parseAsync(req.body);
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

//Playlist id parameter object
//Remover coerce.number(), converter só no middleware final
async function validatePlaylistIDParameter(
  req: Request<PlaylistIDParameter>, //Checar
  res: Response,
  next: NextFunction
) {
  try {
    req.params = await playlistIDParameter.parseAsync(req.params);
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

//Media id parameter object
async function validateMediaQuery(
  req: Request<{}, {}, {}, PlaylistMediaQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    req.query = await playlistMediaQuery.parseAsync(req.query);
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
  validateCreatePlaylistBody,
  validateEditPlaylistBody,
  validatePlaylistIDParameter,
  validateMediaQuery,
};
