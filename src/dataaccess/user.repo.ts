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

// Add to user.repo.ts

export const getUserRankRepo = async (userId: string) => {
    const user = await User.findById(userId).select("scoreForLeaderboard").exec();
    if (!user) return null;

    const rank = await User.countDocuments({
        scoreForLeaderboard: { $gt: user.scoreForLeaderboard }
    }) + 1;

    return { user, rank };
};

// Add to user.service.ts

// Helper function to calculate level from score
const calculateLevel = (score: number): number => {
    return Math.floor(score / 100) + 1;
};

// Helper function to calculate countries visited
const calculateCountriesVisited = (score: number): number => {
    return Math.floor(score / 200);
};

export const getCurrentUserRankService = async (userId: string) => {
    const result = await getUserRankRepo(userId);

    if (!result) {
        throw new Error("User not found");
    }

    const { user, rank } = result;

    return {
        rank,
        score: user.scoreForLeaderboard,
        level: calculateLevel(user.scoreForLeaderboard),
        countriesVisited: calculateCountriesVisited(user.scoreForLeaderboard),
    };
};

// Add to user.auth.controller.ts

export const getCurrentUserRankController = async (req: any, res: any) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const rankData = await getCurrentUserRankService(userId);

        return res.status(200).json({
            success: true,
            data: rankData,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};