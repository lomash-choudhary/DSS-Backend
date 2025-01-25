import { Router } from "express";
import { loginController, signupController } from "../controllers/user.controller.js";

const Userrouter = Router()

Userrouter.route("/signup").post(signupController)
Userrouter.route("/login").post(loginController)

export {Userrouter}