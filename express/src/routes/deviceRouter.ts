//Importando controller
import deviceController from "../controllers/deviceController";
import deviceValidators from "../validators/deviceValidators";
import express from "express";

//Definindo sub-rota
const router = express.Router();

router
  .route("/")
  .get(deviceController.getAllDevices)
  .post(
    deviceValidators.validateCreateDeviceBody,
    deviceController.createDevice
  );

router
  .route("/:id")
  .get(
    deviceValidators.validateDeviceIDParameter,
    deviceController.getDeviceById
  )
  .patch(
    deviceValidators.validateDeviceIDParameter,
    deviceValidators.validateEditDeviceBody,
    deviceController.editDevice
  )
  .delete(
    deviceValidators.validateDeviceIDParameter,
    deviceController.deleteDevice
  );

export default router;
