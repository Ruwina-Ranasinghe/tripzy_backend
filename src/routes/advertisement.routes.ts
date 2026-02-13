import { Router } from "express";
import { authMiddleware } from "../middleware/auth/shield.js";
import { uploadMultiple } from "../middleware/upload.middleware.js";
import {
    createAdvertisementController,
    getAllAdvertisementsController,
    getMyAdvertisementsController,
    getAdvertisementByIdController,
    updateAdvertisementController,
    deleteAdvertisementController,
    contactAdvertiserController,
    getAdvertisementsByCategoryController,
    getAdvertisementsByLocationController,
    getFeaturedAdvertisementsController,
    getUserAdvertisementStatsController,
    searchAdvertisementsController
} from "../controllers/advertisement.controller.js";

export const advertisementRoutes = Router();

// Create Advertisement
advertisementRoutes.post(
    "/create",
    authMiddleware,
    uploadMultiple("images", 10),
    createAdvertisementController
);

// Get All Advertisements
advertisementRoutes.get("/all", getAllAdvertisementsController);

// Get My Advertisements
advertisementRoutes.get(
    "/my-ads",
    authMiddleware,
    getMyAdvertisementsController
);

// Get Featured Advertisements
advertisementRoutes.get("/featured", getFeaturedAdvertisementsController);

// Search Advertisements
advertisementRoutes.get("/search", searchAdvertisementsController);

// Get Advertisement Stats (User)
advertisementRoutes.get(
    "/stats",
    authMiddleware,
    getUserAdvertisementStatsController
);

// Get By Category
advertisementRoutes.get(
    "/category/:category",
    getAdvertisementsByCategoryController
);

// Get By Location
advertisementRoutes.get(
    "/location",
    getAdvertisementsByLocationController
);

// Get Single Advertisement
advertisementRoutes.get("/:id", getAdvertisementByIdController);

// Update Advertisement
advertisementRoutes.put(
    "/update/:id",
    authMiddleware,
    updateAdvertisementController
);

// Delete Advertisement
advertisementRoutes.delete(
    "/delete/:id",
    authMiddleware,
    deleteAdvertisementController
);

// Contact Advertiser
advertisementRoutes.post(
    "/contact/:id",
    authMiddleware,
    contactAdvertiserController
);
