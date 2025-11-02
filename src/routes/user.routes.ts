import {Router} from "express";
import {loginUserController, userSignUpController} from "../controllers/user.auth.controller.js";


export const userRoutes = Router();

userRoutes.post("/signup", userSignUpController);
userRoutes.post("/login", loginUserController)