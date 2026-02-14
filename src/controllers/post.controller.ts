import {
    addCommentService,
    createPostService,
    getAllPostsService,
    getMyTravelLocationsService,
    getRecommendedPostsService,
    likePostService
} from "../services/post.service.js";
import {IRequest} from "../constants/request.js";

export const createPostController = async (req: any, res: any) => {
    try {
        // FIXED: Pass req.files (array) instead of req.file (single)
        const post = await createPostService(req.body, req.files, req.user);

        return res.status(201).json({
            message: "Post created successfully",
            data: post,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const getAllPostsController = async (req: any, res: any) => {
    try {
        const posts = await getAllPostsService();
        return res.status(200).json({
            message: "Posts fetched successfully",
            data: posts,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const getRecommendedPostsController = async (req: any, res: any) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const posts = await getRecommendedPostsService(userId);

        return res.status(200).json({
            message: "Recommended posts fetched successfully",
            data: posts,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const likePostController = async (req: any, res: any) => {
    try {
        const post = await likePostService(req.params.id, req.user);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({
            message: "Post liked/unliked successfully",
            likes: post.likes.length,
            isLiked: post.likes.includes(req.user._id)
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const addCommentController = async (req: any, res: any) => {
    try {
        const { text } = req.body;
        const post = await addCommentService(req.params.id, req.user, text);

        // Populate user info for the new comments
        await post.populate('comments.user', 'displayName picturePath');

        return res.status(200).json({
            message: "Comment added",
            comments: post.comments.map(c => ({
                text: c.text,
                createdAt: c.createdAt,
                user: {
                    _id: c.user._id,
                    username: (c.user as any).displayName || 'Unknown',
                    profileImage: (c.user as any).picturePath || ''
                }
            }))
        });
    } catch (e:any) {
        return res.status(500).json({ message: e.message });
    }
};

export const getMyTravelLocations = async (req: any, res: any) => {
    try {
        const userId =req.user?._id;
        const locations = await getMyTravelLocationsService(userId);
        res.json({ success: true, locations });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};