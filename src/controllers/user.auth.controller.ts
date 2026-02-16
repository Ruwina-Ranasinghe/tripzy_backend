import {NextFunction, Response} from "express";
import {InfoMessages} from "../constants/messages.js";
import {IRequest} from "../constants/request.js";
import {
    getCurrentUserRankService, // ADD THIS
    getLeaderboardService, getUserByIdService,
    loginUserService,
    registerUserService,
    saveUserPreferencesService
} from "../services/user.service.js";

export const userSignUpController = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        console.log(InfoMessages.USER_SIGNUP_STARTED);
        const data = await registerUserService(req.body, req.file);
        console.log(InfoMessages.USER_SIGNUP_SUCCESSFUL);
        res.send(data);
    } catch (e) {
        next(e);
    }
};

export const loginUserController = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const result = await loginUserService(req.body);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// FIXED: Return data in 'data' field
export const getLeaderboardController = async (req: any, res: Response, next: NextFunction) => {
    try {
        const leaderboard = await getLeaderboardService();
        res.status(200).json({
            success: true,
            data: leaderboard // WRAP IN 'data' field
        });
    } catch (error) {
        next(error);
    }
};

// ADD THIS NEW CONTROLLER
export const getCurrentUserRankController = async (req: any, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const rankData = await getCurrentUserRankService(userId);

        return res.status(200).json({
            success: true,
            data: rankData,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const saveUserPreferencesController = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const result = await saveUserPreferencesService(userId, req.body);

        res.status(200).json({
            success: true,
            message: "Preferences saved successfully",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getUserByIdController = async (req: any, res: any, next: NextFunction) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const user = await getUserByIdService(userId);

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        console.error('Error fetching user:', error);
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};