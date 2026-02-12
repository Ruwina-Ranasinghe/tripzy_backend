import {Router} from "express";
import multer from "multer";
import {
    addCommentController,
    createPostController,
    getAllPostsController, getMyTravelLocations, getRecommendedPostsController,
    likePostController
} from "../controllers/post.controller.js";
import { authMiddleware } from "../middleware/auth/shield.js";
const upload = multer({ storage: multer.memoryStorage() });

export const postRoutes = Router();

postRoutes.post("/create", upload.single("image"), authMiddleware,createPostController);
postRoutes.get("/", authMiddleware,getAllPostsController);
postRoutes.post("/like/:id", authMiddleware, likePostController);
postRoutes.post("/comment/:id", authMiddleware, addCommentController);
postRoutes.get("/my-travel-locations", authMiddleware, getMyTravelLocations);
postRoutes.get("/recommended", authMiddleware, getRecommendedPostsController);
