import { uploadToCloudinary } from "./file.service.js";
import {
    addCommentRepo,
    createPostRepo,
    findPostByIdRepo,
    getAllPostsRepo,
    getMyTravelLocationsRepo,
    getRecommendedPostsRepo,
    likePostRepo,
    unlikePostRepo
} from "../dataaccess/post.repo.js";
import geocoder from "../utils/geocoder.js";
import { User } from "../models/user.model.js";

// UPDATED: Support multiple images
export const createPostService = async (
    data: any,
    files?: Express.Multer.File[],
    user?: any
) => {
    // Upload multiple images to Cloudinary
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
        const geo = await geocoder.geocode(data.location);
        if (geo.length > 0 && geo[0].latitude != null && geo[0].longitude != null) {
            coords = {
                lat: Number(geo[0].latitude),
                lng: Number(geo[0].longitude)
            };
        }
    }

    // Determine image layout based on number of images
    let imageLayout: 'single' | 'grid' | 'carousel' | 'collage' = 'single';

    if (data.imageLayout) {
        imageLayout = data.imageLayout;
    } else {
        if (imageUrls.length === 1) {
            imageLayout = 'single';
        } else if (imageUrls.length <= 4) {
            imageLayout = 'grid';
        } else if (imageUrls.length <= 6) {
            imageLayout = 'collage';
        } else {
            imageLayout = 'carousel';
        }
    }

    // Save post with multiple images
    const newPost = await createPostRepo({
        caption: data.caption || "",
        imageUrl: imageUrls,
        imageLayout: imageLayout,
        location: data.location,
        locationCoords: coords,
        taggedPeople: [],
        postedBy: user._id,
        likes: [],
        comments: [],
        impressions: 0,
    });

    // NEW: Add 5 points to user's leaderboard score
    await User.findByIdAndUpdate(user._id, {
        $inc: { scoreForLeaderboard: 5 }
    });

    // Populate user
    await newPost.populate("postedBy", "displayName picturePath");

    const p = newPost.toObject();

    return {
        ...p,
        username: (p.postedBy as any)?.displayName || "Unknown",
        profileImage: (p.postedBy as any)?.picturePath || "",
        likes: p.likes.length,
        comments: p.comments.length,
        images: p.imageUrl || [],
        imageLayout: p.imageLayout || 'single'
    };
};

export const getAllPostsService = async () => {
    const posts = await getAllPostsRepo();

    return posts.map(post => {
        const p = post.toObject();
        const postedByUser = post.postedBy as any;
        return {
            ...p,
            username: postedByUser?.displayName || 'Unknown',
            profileImage: postedByUser?.picturePath || null,
            likes: p.likes.length,
            comments: p.comments.length,
            images: p.imageUrl || [],
            imageLayout: p.imageLayout || 'single'
        };
    });
};

export const getRecommendedPostsService = async (userId: string) => {
    const posts = await getRecommendedPostsRepo(userId);

    return posts.map(post => {
        const p = post.toObject();
        const postedByUser = post.postedBy as any;
        return {
            ...p,
            username: postedByUser?.displayName || 'Unknown',
            profileImage: postedByUser?.picturePath || null,
            likes: p.likes.length,
            comments: p.comments.length,
            images: p.imageUrl || [],
            imageLayout: p.imageLayout || 'single'
        };
    });
};

export const likePostService = async (postId: string, user?: any) => {
    const post = await findPostByIdRepo(postId);
    if (!post) throw new Error("Post not found");

    const isLiked = post.likes.includes(user._id);

    let updatedPost;

    if (isLiked) {
        updatedPost = await unlikePostRepo(postId, user._id);
    } else {
        updatedPost = await likePostRepo(postId, user._id);

        // Merge post AI tags into user's interestTags
        if (post.aiTags && post.aiTags.length > 0) {
            await User.findByIdAndUpdate(user._id, {
                $addToSet: { interestTags: { $each: post.aiTags } }
            });
        }
    }

    return updatedPost;
};

export const addCommentService = async (postId: string, user: any, text: string) => {
    const comment = {
        user: user._id,
        text,
        createdAt: new Date()
    };

    const updatedPost = await addCommentRepo(postId, comment);
    if (!updatedPost) throw new Error("Post not found");

    // Merge post AI tags into user's interestTags
    if (updatedPost.aiTags && updatedPost.aiTags.length > 0) {
        await User.findByIdAndUpdate(user._id, {
            $addToSet: { interestTags: { $each: updatedPost.aiTags } }
        });
    }

    return updatedPost;
};

export const getMyTravelLocationsService = async (userId: string) => {
    const posts = await getMyTravelLocationsRepo(userId);

    return posts.map(p => ({
        location: p.location,
        lat: p.locationCoords?.lat,
        lng: p.locationCoords?.lng,
        date: p.createdAt
    }));
};