import {
    createUserRepo,
    findOneUserRepo,
    getTopUsersRepo,
    getUserRankRepo, // ADD THIS
    updateUserPreferencesRepo
} from "../dataaccess/user.repo.js";
import { ErrorMessages } from "../constants/messages.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {uploadToCloudinary} from "./file.service.js";

// ADD THESE HELPER FUNCTIONS
const calculateLevel = (score: number): number => {
    return Math.floor(score / 100) + 1;
};

const calculateCountriesVisited = (score: number): number => {
    return Math.floor(score / 200);
};

export const registerUserService = async (data: any, file?: Express.Multer.File) => {
    const exist = await findOneUserRepo({ email: data.email });
    if (exist) throw new Error(ErrorMessages.USER_ALREADY_EXIST);

    let picturePath: string | undefined = undefined;
    if (file) {
        picturePath = await uploadToCloudinary(file);
    }

    const user = await createUserRepo({
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: data.displayName,
        email: data.email,
        password: data.password,
        country: data.country,
        picturePath,
    });

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || "supersecretkey",
        { expiresIn: "7d" }
    );

    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        email: user.email,
        country: user.country,
        picturePath: user.picturePath || "",
        token,
    };
};

export const loginUserService = async (data: any) => {
    if (!data.email || !data.password) {
        throw new Error("Email and password required");
    }

    const user = await findOneUserRepo({ email: data.email });
    if (!user) throw new Error(ErrorMessages.USER_NOT_FOUND);

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error(ErrorMessages.INVALID_CREDENTIALS);

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || "supersecretkey",
        { expiresIn: "7d" }
    );

    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        email: user.email,
        country: user.country,
        token,
    };
};

// UPDATED: Return data inside 'data' field
export const getLeaderboardService = async () => {
    const topUsers = await getTopUsersRepo(10);

    return topUsers.map(user => ({
        id: user._id,
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        scoreForLeaderboard: user.scoreForLeaderboard,
        picturePath: user.picturePath,
        level: calculateLevel(user.scoreForLeaderboard),
        countriesVisited: calculateCountriesVisited(user.scoreForLeaderboard),
    }));
};

// ADD THIS NEW SERVICE
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

export const saveUserPreferencesService = async (userId: string, data: any) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const preferences = {
        travelStyle: data.travelStyle || [],
        travelCompanion: data.companion || "",
        activities: data.activities || [],
        preferredDestinations: data.destinations || [],
        weather: data.weather || "",
        stayType: data.accommodation?.[0] || "",
    };

    const updatedUser = await updateUserPreferencesRepo(userId, preferences);

    if (!updatedUser) {
        throw new Error("User not found");
    }

    return {
        id: updatedUser._id,
        displayName: updatedUser.displayName,
        preferences: updatedUser.preferences,
    };
};