import {
    createAdvertisementService,
    getAllAdvertisementsService,
    getMyAdvertisementsService,
    getAdvertisementByIdService,
    updateAdvertisementService,
    deleteAdvertisementService,
    addInquiryService,
    getAdvertisementsByCategoryService,
    getAdvertisementsByLocationService,
    getFeaturedAdvertisementsService,
    getUserAdvertisementStatsService,
    searchAdvertisementsService
} from "../services/advertisement.service.js";

/**
 * Create a new advertisement
 */
export const createAdvertisementController = async (req: any, res: any) => {
    try {
        // req.files contains multiple images
        const files = req.files || [];

        const advertisement = await createAdvertisementService(
            req.body,
            files,
            req.user
        );

        return res.status(201).json({
            success: true,
            message: "Advertisement created successfully",
            data: advertisement,
        });
    } catch (error: any) {
        console.error("Create advertisement error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get all advertisements with optional filters
 */
export const getAllAdvertisementsController = async (req: any, res: any) => {
    try {
        const { category, status, search } = req.query;

        const filters = {
            category: category || undefined,
            status: status || 'active',
            search: search || undefined
        };

        const advertisements = await getAllAdvertisementsService(filters);

        return res.status(200).json({
            success: true,
            message: "Advertisements fetched successfully",
            data: advertisements,
            count: advertisements.length
        });
    } catch (error: any) {
        console.error("Get all advertisements error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get advertisements posted by the authenticated user
 */
export const getMyAdvertisementsController = async (req: any, res: any) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const advertisements = await getMyAdvertisementsService(userId);

        return res.status(200).json({
            success: true,
            message: "Your advertisements fetched successfully",
            data: advertisements,
            count: advertisements.length
        });
    } catch (error: any) {
        console.error("Get my advertisements error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get a single advertisement by ID
 */
export const getAdvertisementByIdController = async (req: any, res: any) => {
    try {
        const { id } = req.params;

        const advertisement = await getAdvertisementByIdService(id);

        return res.status(200).json({
            success: true,
            message: "Advertisement fetched successfully",
            data: advertisement
        });
    } catch (error: any) {
        console.error("Get advertisement by ID error:", error);
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Update an advertisement
 */
export const updateAdvertisementController = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const updatedAdvertisement = await updateAdvertisementService(
            id,
            userId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Advertisement updated successfully",
            data: updatedAdvertisement
        });
    } catch (error: any) {
        console.error("Update advertisement error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Delete an advertisement
 */
export const deleteAdvertisementController = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const result = await deleteAdvertisementService(id, userId);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error: any) {
        console.error("Delete advertisement error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Add an inquiry/contact message to an advertisement
 */
export const contactAdvertiserController = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const result = await addInquiryService(id, user, message.trim());

        return res.status(200).json({
            success: true,
            message: result.message,
            inquiries: result.inquiries
        });
    } catch (error: any) {
        console.error("Contact advertiser error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get advertisements by category
 */
export const getAdvertisementsByCategoryController = async (req: any, res: any) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const advertisements = await getAdvertisementsByCategoryService(
            category,
            parseInt(page),
            parseInt(limit)
        );

        return res.status(200).json({
            success: true,
            message: `${category} advertisements fetched successfully`,
            data: advertisements,
            count: advertisements.length,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error: any) {
        console.error("Get advertisements by category error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get advertisements by location
 */
export const getAdvertisementsByLocationController = async (req: any, res: any) => {
    try {
        const { location } = req.query;

        if (!location) {
            return res.status(400).json({
                success: false,
                message: "Location parameter is required"
            });
        }

        const advertisements = await getAdvertisementsByLocationService(location);

        return res.status(200).json({
            success: true,
            message: "Advertisements fetched successfully",
            data: advertisements,
            count: advertisements.length
        });
    } catch (error: any) {
        console.error("Get advertisements by location error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get featured/popular advertisements
 */
export const getFeaturedAdvertisementsController = async (req: any, res: any) => {
    try {
        const { limit = 10 } = req.query;

        const advertisements = await getFeaturedAdvertisementsService(parseInt(limit));

        return res.status(200).json({
            success: true,
            message: "Featured advertisements fetched successfully",
            data: advertisements,
            count: advertisements.length
        });
    } catch (error: any) {
        console.error("Get featured advertisements error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get user's advertisement statistics
 */
export const getUserAdvertisementStatsController = async (req: any, res: any) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const stats = await getUserAdvertisementStatsService(userId);

        return res.status(200).json({
            success: true,
            message: "Statistics fetched successfully",
            data: stats
        });
    } catch (error: any) {
        console.error("Get user advertisement stats error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Search advertisements with multiple filters
 */
export const searchAdvertisementsController = async (req: any, res: any) => {
    try {
        const {
            query,
            category,
            location,
            minPrice,
            maxPrice,
            page = 1,
            limit = 20
        } = req.query;

        const searchParams = {
            query,
            category,
            location,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            page: parseInt(page),
            limit: parseInt(limit)
        };

        const advertisements = await searchAdvertisementsService(searchParams);

        return res.status(200).json({
            success: true,
            message: "Search results fetched successfully",
            data: advertisements,
            count: advertisements.length,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error: any) {
        console.error("Search advertisements error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};