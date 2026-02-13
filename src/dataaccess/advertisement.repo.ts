import { IAdvertisement, Advertisement } from "../models/advertisement.model.js";
import mongoose from "mongoose";

/**
 * Create a new advertisement
 */
export const createAdvertisementRepo = (data: Partial<IAdvertisement>) => {
    return new Advertisement(data).save();
};

/**
 * Find advertisement by ID
 */
export const findAdvertisementByIdRepo = (id: string) => {
    return Advertisement.findById(id)
        .populate("postedBy", "displayName firstName lastName picturePath email")
        .populate("inquiries.user", "displayName picturePath")
        .exec();
};

/**
 * Get all advertisements with optional filters
 */
export const getAllAdvertisementsRepo = (filters: {
    category?: string;
    status?: string;
    search?: string;
}) => {
    const query: any = {};

    // Category filter
    if (filters.category) {
        query.category = filters.category;
    }

    // Status filter (default to active)
    query.status = filters.status || 'active';

    // Search filter
    if (filters.search) {
        query.$text = { $search: filters.search };
    }

    return Advertisement.find(query)
        .populate("postedBy", "displayName firstName lastName picturePath")
        .sort({ createdAt: -1 })
        .exec();
};

/**
 * Get advertisements posted by a specific user
 */
export const getMyAdvertisementsRepo = (userId: string) => {
    return Advertisement.find({ postedBy: userId })
        .populate("postedBy", "displayName firstName lastName picturePath")
        .sort({ createdAt: -1 })
        .exec();
};

/**
 * Update an advertisement
 */
export const updateAdvertisementRepo = (
    adId: string,
    userId: string,
    updateData: Partial<IAdvertisement>
) => {
    return Advertisement.findOneAndUpdate(
        { _id: adId, postedBy: userId }, // Ensure user owns the ad
        { $set: updateData },
        { new: true, runValidators: true }
    )
        .populate("postedBy", "displayName firstName lastName picturePath")
        .exec();
};

/**
 * Delete an advertisement
 */
export const deleteAdvertisementRepo = (adId: string, userId: string) => {
    return Advertisement.findOneAndDelete({
        _id: adId,
        postedBy: userId
    }).exec();
};

/**
 * Add an inquiry to an advertisement
 */
export const addInquiryRepo = (
    adId: string,
    inquiryData: {
        user: mongoose.Types.ObjectId;
        message: string;
        createdAt: Date;
    }
) => {
    return Advertisement.findByIdAndUpdate(
        adId,
        { $push: { inquiries: inquiryData } },
        { new: true }
    )
        .populate("inquiries.user", "displayName picturePath")
        .exec();
};

/**
 * Increment view count
 */
export const incrementViewsRepo = (adId: string) => {
    return Advertisement.findByIdAndUpdate(
        adId,
        { $inc: { views: 1 } },
        { new: true }
    ).exec();
};

/**
 * Increment impression count
 */
export const incrementImpressionsRepo = (adId: string) => {
    return Advertisement.findByIdAndUpdate(
        adId,
        { $inc: { impressions: 1 } },
        { new: true }
    ).exec();
};

/**
 * Get advertisements by category with pagination
 */
export const getAdvertisementsByCategoryRepo = (
    category: string,
    page: number = 1,
    limit: number = 20
) => {
    const skip = (page - 1) * limit;

    return Advertisement.find({
        category,
        status: 'active'
    })
        .populate("postedBy", "displayName firstName lastName picturePath")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
};

/**
 * Get advertisements by location (text search)
 */
export const getAdvertisementsByLocationRepo = (location: string) => {
    return Advertisement.find({
        location: { $regex: location, $options: 'i' },
        status: 'active'
    })
        .populate("postedBy", "displayName firstName lastName picturePath")
        .sort({ createdAt: -1 })
        .exec();
};

/**
 * Get featured/popular advertisements (by views)
 */
export const getFeaturedAdvertisementsRepo = (limit: number = 10) => {
    return Advertisement.find({ status: 'active' })
        .populate("postedBy", "displayName firstName lastName picturePath")
        .sort({ views: -1, createdAt: -1 })
        .limit(limit)
        .exec();
};

/**
 * Update advertisement status
 */
export const updateAdvertisementStatusRepo = (
    adId: string,
    status: 'active' | 'inactive' | 'pending'
) => {
    return Advertisement.findByIdAndUpdate(
        adId,
        { $set: { status } },
        { new: true }
    ).exec();
};

/**
 * Get advertisement statistics for a user
 */
export const getUserAdvertisementStatsRepo = async (userId: string) => {
    const stats = await Advertisement.aggregate([
        { $match: { postedBy: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: null,
                totalAds: { $sum: 1 },
                activeAds: {
                    $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
                },
                totalViews: { $sum: "$views" },
                totalInquiries: { $sum: { $size: "$inquiries" } }
            }
        }
    ]);

    return stats.length > 0 ? stats[0] : {
        totalAds: 0,
        activeAds: 0,
        totalViews: 0,
        totalInquiries: 0
    };
};

/**
 * Search advertisements with filters
 */
export const searchAdvertisementsRepo = (searchParams: {
    query?: string;
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}) => {
    const {
        query,
        category,
        location,
        minPrice,
        maxPrice,
        page = 1,
        limit = 20
    } = searchParams;

    const filter: any = { status: 'active' };

    // Text search
    if (query) {
        filter.$text = { $search: query };
    }

    // Category filter
    if (category) {
        filter.category = category;
    }

    // Location filter
    if (location) {
        filter.location = { $regex: location, $options: 'i' };
    }

    // Price filter (category-specific)
    if (minPrice !== undefined || maxPrice !== undefined) {
        const priceFilter: any = {};

        if (minPrice !== undefined) {
            priceFilter.$gte = minPrice;
        }
        if (maxPrice !== undefined) {
            priceFilter.$lte = maxPrice;
        }

        filter.$or = [
            { 'details.pricePerNight': priceFilter },
            { 'details.pricePerDay': priceFilter },
            { 'details.price': priceFilter }
        ];
    }

    const skip = (page - 1) * limit;

    return Advertisement.find(filter)
        .populate("postedBy", "displayName firstName lastName picturePath")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
};