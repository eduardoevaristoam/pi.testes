//Importando controller
const mediaController = require("./../controllers/mediaController");
const express = require("express");
//Importando Multer
const multer = require("multer");
//Configurando Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Definindo sub-rota
const route = express.Router();

route
  .route("/")
  .get(mediaController.getAllMedia)
  .post(
    upload.single("media"),
    mediaController.checkBody,
    mediaController.postMedia
  );

module.exports = route;
