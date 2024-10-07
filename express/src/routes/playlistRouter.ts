//Importando controller de playlists
import playlistController from "./../controllers/playlistController";
import playlistValidators from "./../validators/playlistValidators";
//mediaController é usado por algumas rotas
//const mediaController = require("../src/controllers/mediaController");
import mediaController from "./../controllers/mediaController";

import express from "express";
const router = express.Router();

//Importando Multer
import multer from "multer";
//Configurando Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route("/")
  .get(playlistController.getAllPlaylists)
  .post(
    playlistValidators.validateCreatePlaylistBody,
    playlistController.createPlaylist
  );

router
  .route("/:id")
  .get(
    playlistValidators.validatePlaylistIDParameter,
    playlistController.getPlaylistById
  )
  .put(
    playlistValidators.validatePlaylistIDParameter,
    playlistValidators.validateEditPlaylistBody,
    playlistController.editPlaylist
  )
  .delete(
    playlistValidators.validatePlaylistIDParameter,
    playlistController.deletePlaylist
  );

router
  .route("/:id/media")
  .get(
    playlistValidators.validatePlaylistIDParameter,
    playlistValidators.validateMediaQuery,
    mediaController.getMediaByPlaylist
  )
  .post(
    playlistValidators.validatePlaylistIDParameter,
    upload.single("media"),
    mediaController.checkBody,
    mediaController.checkMimeType,
    mediaController.putNewMedia,
    mediaController.postMedia
  );

export default router;
