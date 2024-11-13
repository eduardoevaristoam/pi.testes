import express from "express";
import loginController from "../controllers/loginController";

//Definindo sub-rota
const router = express.Router();

router.route("/").post(loginController.loginUser);

//Para debugar apenas, remover depois
router.route("/check").post(loginController.isUserLoggedIn);

export default router;
