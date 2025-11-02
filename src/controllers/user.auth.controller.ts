import {NextFunction, Response} from "express";
import {InfoMessages} from "../constants/messages.js";
import {IRequest} from "../constants/request.js";
import {loginUserService, registerUserService} from "../services/user.service.js";

export const userSignUpController = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        console.log(InfoMessages.USER_SIGNUP_STARTED);
        const data = await registerUserService(req.body);
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

