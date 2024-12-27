//Importando express
import express from "express";
//Importando controller
import mediaController from "../controllers/mediaController";
//Importando validators
import mediaValidators from "../validators/mediaValidators";
//Importando Multer
import multer from "multer";
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
  .get(mediaValidators.validateMediaIDParameter, mediaController.getMediaById)
  .delete(
    mediaValidators.validateMediaIDParameter,
    mediaController.deleteMediaBucket,
    mediaController.deleteMedia
  );

module.exports = router;
