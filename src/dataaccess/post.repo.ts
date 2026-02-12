import {IPost, Post} from "../models/post.model.js";
import {User} from "../models/user.model.js";

export const createPostRepo = (data: Partial<IPost>) => {
    return new Post(data).save();
};

export const findPostByIdRepo = (id: string) => {
    return Post.findById(id).exec();
};

export const getAllPostsRepo = () => {
    return Post.find()
        .populate("postedBy", "displayName firstName lastName picturePath")
        .populate("taggedPeople", "displayName picturePath")
        .sort({ createdAt: -1 })
        .exec();
};
// export const addCommentRepo = (postId: string, commentData: any) => {
//     return Post.findByIdAndUpdate(
//         postId,
//         { $push: { comments: commentData } },
//         { new: true }
//     ).exec();
// };
export const getRecommendedPostsRepo = async (userId: string) => {
    // Step 1: Get posts the user liked or commented on
    const likedPosts = await Post.find({ likes: userId }).select("caption aiTags").exec();
    const commentedPosts = await Post.find({ "comments.user": userId }).select("caption aiTags").exec();

    const allPosts = [...likedPosts, ...commentedPosts];

    // Step 2: Collect keywords / tags
    let keywords: string[] = [];
    allPosts.forEach(post => {
        if (post.caption) {
            const words = post.caption
                .toLowerCase()
                .split(/\W+/)
                .filter(w => w.length > 3);
            keywords.push(...words);
        }
        if (post.aiTags) keywords.push(...post.aiTags);
    });

    // Step 3: Deduplicate
    keywords = Array.from(new Set(keywords));

    if (keywords.length === 0) {
        // Fallback: show latest posts
        return Post.find()
            .populate("postedBy", "displayName picturePath")
            .sort({ createdAt: -1 })
            .limit(20)
            .exec();
    }

    // Step 4: Recommend posts matching keywords
    return Post.find({
        $or: [
            { caption: { $regex: keywords.join("|"), $options: "i" } },
            { aiTags: { $in: keywords } }
        ],
        postedBy: { $ne: userId } // optional: exclude user's own posts
    })
        .populate("postedBy", "displayName picturePath")
        .sort({ createdAt: -1 })
        .limit(20)
        .exec();
};


export const likePostRepo = (postId: string, userId: any) => {
    return Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true }
    ).exec();
};

export const unlikePostRepo = (postId: string, userId: any) => {
    return Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
    ).exec();
};

export const addCommentRepo = (postId: string, commentData: any) => {
    return Post.findByIdAndUpdate(
        postId,
        { $push: { comments: commentData } },
        { new: true }
    ).exec();
};

export const getMyTravelLocationsRepo = async (userId: string) => {
    return Post.find({
        postedBy: userId,
        locationCoords: { $exists: true }
    })
        .select("location locationCoords createdAt")
        .sort({ createdAt: -1 });
};


