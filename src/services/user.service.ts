import {createUserRepo, findOneUserRepo, getTopUsersRepo, updateUserPreferencesRepo} from "../dataaccess/user.repo.js";
import { ErrorMessages } from "../constants/messages.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {uploadToCloudinary} from "./file.service.js";

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
        picturePath, // save image URL
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

export const getLeaderboardService = async () => {
    const topUsers = await getTopUsersRepo(10); // top 10 users
    return topUsers.map(user => ({
        id: user._id,
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        score: user.scoreForLeaderboard,
        picturePath: user.picturePath,
    }));
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
        stayType: data.accommodation?.[0] || "", // Take first accommodation type
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
