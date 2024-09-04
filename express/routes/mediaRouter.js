//Importando controller
const mediaController = require("./../controllers/mediaController");
const express = require("express");
//Importando Multer
const multer = require("multer");
//Configurando Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Definindo sub-rota
const router = express.Router();

router
  .route("/")
  .get(mediaController.getAllMedia)
  .post(
    upload.single("media"),
    mediaController.checkBody,
    mediaController.checkMimeType,
    mediaController.putNewMedia,
    mediaController.postMedia
  );

router
  .route("/:uuid")
  .get(mediaController.getMediaById)
  .delete(mediaController.deleteMediaBucket, mediaController.deleteMedia);

module.exports = router;
