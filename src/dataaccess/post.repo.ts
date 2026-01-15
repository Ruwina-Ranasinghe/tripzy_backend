import {IPost, Post} from "../models/post.model.js";

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


