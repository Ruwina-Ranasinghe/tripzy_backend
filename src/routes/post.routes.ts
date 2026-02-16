import {Router} from "express";
import multer from "multer";
import {
    addCommentController,
    createPostController,
    getAllPostsController, getMyPostsController, getMyTravelLocations, getRecommendedPostsController,
    getUserPostsByIdController,
    likePostController
} from "../controllers/post.controller.js";
import { authMiddleware } from "../middleware/auth/shield.js";
const upload = multer({ storage: multer.memoryStorage() });

export const postRoutes = Router();

postRoutes.post(
    "/create",
    authMiddleware,
    upload.array("images", 10),
    createPostController
);
postRoutes.get("/", authMiddleware,getAllPostsController);
postRoutes.post("/like/:id", authMiddleware, likePostController);
postRoutes.post("/comment/:id", authMiddleware, addCommentController);
postRoutes.get("/my-travel-locations", authMiddleware, getMyTravelLocations);
postRoutes.get("/recommended", authMiddleware, getRecommendedPostsController);
postRoutes.get("/my-posts", authMiddleware, getMyPostsController);
postRoutes.get("/user/:userId", authMiddleware, getUserPostsByIdController);
