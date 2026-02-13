import { uploadToCloudinary } from "./file.service.js";
import {
    createAdvertisementRepo,
    findAdvertisementByIdRepo,
    getAllAdvertisementsRepo,
    getMyAdvertisementsRepo,
    updateAdvertisementRepo,
    deleteAdvertisementRepo,
    addInquiryRepo,
    incrementViewsRepo,
    getAdvertisementsByCategoryRepo,
    getAdvertisementsByLocationRepo,
    getFeaturedAdvertisementsRepo,
    getUserAdvertisementStatsRepo,
    searchAdvertisementsRepo
} from "../dataaccess/advertisement.repo.js";
import geocoder from "../utils/geocoder.js";
import { IAdvertisement } from "../models/advertisement.model.js";

/**
 * Create a new advertisement
 */
export const createAdvertisementService = async (
    data: any,
    files: Express.Multer.File[],
    user: any
) => {
    // Upload images to Cloudinary
    const imageUrls: string[] = [];

    if (files && files.length > 0) {
        for (const file of files) {
            const imageUrl = await uploadToCloudinary(file);
            imageUrls.push(imageUrl);
        }
    }

    // Geocode location if provided
    let coords: { lat: number; lng: number } | undefined = undefined;

    if (data.location) {
        try {
            const geo = await geocoder.geocode(data.location);
            if (geo.length > 0 && geo[0].latitude != null && geo[0].longitude != null) {
                coords = {
                    lat: Number(geo[0].latitude),
                    lng: Number(geo[0].longitude)
                };
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            // Continue without coordinates
        }
    }

    // Parse details from JSON string if needed
    let details = data.details;
    if (typeof details === 'string') {
        details = JSON.parse(details);
    }

    // Create advertisement
    const newAd = await createAdvertisementRepo({
        category: data.category,
        title: data.title,
        description: data.description,
        images: imageUrls,
        location: data.location,
        locationCoords: coords,
        details: details,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        postedBy: user._id,
        inquiries: [],
        status: 'active',
        views: 0,
        impressions: 0
    });

    // Populate user data
    await newAd.populate("postedBy", "displayName picturePath");

    const ad = newAd.toObject();

    return {
        ...ad,
        username: (ad.postedBy as any)?.displayName || "Unknown",
        profileImage: (ad.postedBy as any)?.picturePath || "",
    };
};

/**
 * Get all advertisements with filters
 */
export const getAllAdvertisementsService = async (filters: {
    category?: string;
    status?: string;
    search?: string;
}) => {
    const advertisements = await getAllAdvertisementsRepo(filters);

    return advertisements.map(ad => {
        const adObj = ad.toObject();
        const postedByUser = ad.postedBy as any;
        return {
            ...adObj,
            username: postedByUser?.displayName || 'Unknown',
            profileImage: postedByUser?.picturePath || null,
        };
    });
};

/**
 * Get advertisements posted by the user
 */
export const getMyAdvertisementsService = async (userId: string) => {
    const advertisements = await getMyAdvertisementsRepo(userId);

    return advertisements.map(ad => {
        const adObj = ad.toObject();
        const postedByUser = ad.postedBy as any;
        return {
            ...adObj,
            username: postedByUser?.displayName || 'Unknown',
            profileImage: postedByUser?.picturePath || null,
        };
    });
};

/**
 * Get advertisement by ID with view increment
 */
export const getAdvertisementByIdService = async (adId: string) => {
    const advertisement = await findAdvertisementByIdRepo(adId);

    if (!advertisement) {
        throw new Error("Advertisement not found");
    }

    // Increment view count
    await incrementViewsRepo(adId);

    const adObj = advertisement.toObject();
    const postedByUser = advertisement.postedBy as any;

    return {
        ...adObj,
        username: postedByUser?.displayName || 'Unknown',
        profileImage: postedByUser?.picturePath || null,
    };
};

/**
 * Update an advertisement
 */
export const updateAdvertisementService = async (
    adId: string,
    userId: string,
    updateData: Partial<IAdvertisement>
) => {
    // Parse details if it's a string
    if (updateData.details && typeof updateData.details === 'string') {
        updateData.details = JSON.parse(updateData.details as any);
    }

    const updatedAd = await updateAdvertisementRepo(adId, userId, updateData);

    if (!updatedAd) {
        throw new Error("Advertisement not found or you don't have permission to update it");
    }

    const adObj = updatedAd.toObject();
    const postedByUser = updatedAd.postedBy as any;

    return {
        ...adObj,
        username: postedByUser?.displayName || 'Unknown',
        profileImage: postedByUser?.picturePath || null,
    };
};

/**
 * Delete an advertisement
 */
export const deleteAdvertisementService = async (adId: string, userId: string) => {
    const deletedAd = await deleteAdvertisementRepo(adId, userId);

    if (!deletedAd) {
        throw new Error("Advertisement not found or you don't have permission to delete it");
    }

    return { message: "Advertisement deleted successfully" };
};

/**
 * Add an inquiry to an advertisement
 */
export const addInquiryService = async (
    adId: string,
    user: any,
    message: string
) => {
    const inquiry = {
        user: user._id,
        message: message,
        createdAt: new Date()
    };

    const updatedAd = await addInquiryRepo(adId, inquiry);

    if (!updatedAd) {
        throw new Error("Advertisement not found");
    }

    return {
        message: "Inquiry sent successfully",
        inquiries: updatedAd.inquiries.map(inq => ({
            message: inq.message,
            createdAt: inq.createdAt,
            user: {
                _id: inq.user._id,
                username: (inq.user as any).displayName || 'Unknown',
                profileImage: (inq.user as any).picturePath || ''
            }
        }))
    };
};

/**
 * Get advertisements by category
 */
export const getAdvertisementsByCategoryService = async (
    category: string,
    page: number = 1,
    limit: number = 20
) => {
    const advertisements = await getAdvertisementsByCategoryRepo(category, page, limit);

    return advertisements.map(ad => {
        const adObj = ad.toObject();
        const postedByUser = ad.postedBy as any;
        return {
            ...adObj,
            username: postedByUser?.displayName || 'Unknown',
            profileImage: postedByUser?.picturePath || null,
        };
    });
};

/**
 * Get advertisements by location
 */
export const getAdvertisementsByLocationService = async (location: string) => {
    const advertisements = await getAdvertisementsByLocationRepo(location);

    return advertisements.map(ad => {
        const adObj = ad.toObject();
        const postedByUser = ad.postedBy as any;
        return {
            ...adObj,
            username: postedByUser?.displayName || 'Unknown',
            profileImage: postedByUser?.picturePath || null,
        };
    });
};

/**
 * Get featured advertisements
 */
export const getFeaturedAdvertisementsService = async (limit: number = 10) => {
    const advertisements = await getFeaturedAdvertisementsRepo(limit);

    return advertisements.map(ad => {
        const adObj = ad.toObject();
        const postedByUser = ad.postedBy as any;
        return {
            ...adObj,
            username: postedByUser?.displayName || 'Unknown',
            profileImage: postedByUser?.picturePath || null,
        };
    });
};

/**
 * Get user's advertisement statistics
 */
export const getUserAdvertisementStatsService = async (userId: string) => {
    return await getUserAdvertisementStatsRepo(userId);
};

/**
 * Search advertisements
 */
export const searchAdvertisementsService = async (searchParams: {
    query?: string;
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}) => {
    const advertisements = await searchAdvertisementsRepo(searchParams);

    return advertisements.map(ad => {
        const adObj = ad.toObject();
        const postedByUser = ad.postedBy as any;
        return {
            ...adObj,
            username: postedByUser?.displayName || 'Unknown',
            profileImage: postedByUser?.picturePath || null,
        };
    });
};