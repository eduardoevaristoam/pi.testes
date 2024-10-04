//Importando controller
const playlistController = require("../controllers/playlistController");
//mediaController é usado por algumas rotas
const mediaController = require("./../controllers/mediaController");

const express = require("express");
const router = express.Router();
//Importando Multer
const multer = require("multer");
//Configurando Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route("/")
  .get(playlistController.getAllPlaylists)
  .post(playlistController.createPlaylist);

router
  .route("/:id")
  .get(playlistController.getPlaylistById)
  .put(playlistController.editPlaylist)
  .delete(playlistController.deletePlaylist);

router
  .route("/:id/media")
  .get(mediaController.getMediaByPlaylist)
  .post(
    upload.single("media"),
    mediaController.checkBody,
    mediaController.checkMimeType,
    mediaController.putNewMedia,
    mediaController.postMedia
  );

module.exports = router;
