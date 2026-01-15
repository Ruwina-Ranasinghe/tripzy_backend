import { uploadToCloudinary } from "./file.service.js";
import {
    addCommentRepo,
    createPostRepo,
    findPostByIdRepo,
    getAllPostsRepo, getMyTravelLocationsRepo,
    likePostRepo,
    unlikePostRepo
} from "../dataaccess/post.repo.js";
import geocoder from "../utils/geocoder.js";

export const createPostService = async (data: any, file?: Express.Multer.File, user?: any) => {
    let imageUrl: string | undefined = undefined;

    if (file) {
        imageUrl = await uploadToCloudinary(file);
    }
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

    // Save post
    const newPost = await createPostRepo({
        caption: data.caption || "",
        imageUrl,
        location: data.location,
        locationCoords: coords,
        taggedPeople: [],
        postedBy: user._id,
        likes: [],
        comments: [],
        impressions: 0,
    });

    // Populate postedBy user fields
    await newPost.populate("postedBy", "displayName picturePath");

    const p = newPost.toObject();

    // Return formatted post including username
    return {
        ...p,
        username: (p.postedBy as any)?.displayName || "Unknown",
        profileImage: (p.postedBy as any)?.picturePath || "",
        likes: p.likes.length,
        comments: p.comments.length,
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




