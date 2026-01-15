import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import {IRequest} from "../../constants/request.js";


export const authMiddleware = (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "supersecretkey"
        ) as { id: string; email: string };

        req.user = { _id: decoded.id, email: decoded.email };
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};