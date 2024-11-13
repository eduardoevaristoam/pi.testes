import express from "express";
import loginController from "../controllers/loginController";

//Definindo sub-rota
const router = express.Router();

router.route("/").post(loginController.loginUser);

router.route("/check").post(loginController.isUserLoggedIn);

router.route("/logout").post(loginController.logOut);

export default router;
