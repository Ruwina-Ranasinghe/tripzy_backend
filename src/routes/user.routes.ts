import {Router} from "express";
import multer from "multer";
import {
    getLeaderboardController,
    loginUserController, saveUserPreferencesController,
    userSignUpController
} from "../controllers/user.auth.controller.js";
import {authMiddleware} from "../middleware/auth/shield.js";
const upload = multer({ storage: multer.memoryStorage() });


export const userRoutes = Router();

userRoutes.post("/signup",upload.single("profileImage"), userSignUpController);
userRoutes.post("/login", loginUserController)
userRoutes.get("/leaderboard", getLeaderboardController);
userRoutes.post("/preferences", authMiddleware, saveUserPreferencesController);