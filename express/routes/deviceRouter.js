//Importando controller
const deviceController = require("./../controllers/deviceController");
const express = require("express");

//Definindo sub-rota
const router = express.Router();

router
  .route("/")
  .get(deviceController.getAllDevices)
  .post(deviceController.createDevice);

router
  .route("/:id")
  .get(deviceController.getDeviceById)
  .patch(deviceController.editDevice)
  .delete(deviceController.deleteDevice);

module.exports = router;
