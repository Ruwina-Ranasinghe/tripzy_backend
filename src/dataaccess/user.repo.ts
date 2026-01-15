import { User } from "../models/user.model.js";

export const findOneUserRepo = (filters: any) => {
    return User.findOne(filters).select("+password").exec();
};

export const createUserRepo = (data: any) => {
    return new User(data).save();
};
export const getTopUsersRepo = (limit: number) => {
    return User.find()
        .sort({ scoreForLeaderboard: -1 }) // highest score first
        .limit(limit)
        .select("firstName lastName displayName country scoreForLeaderboard picturePath")
        .exec();
};
export const updateUserPreferencesRepo = (userId: string, preferences: any) => {
    return User.findByIdAndUpdate(
        userId,
        { $set: { preferences } },
        { new: true }
    ).select("firstName lastName displayName preferences").exec();
};