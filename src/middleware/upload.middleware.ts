import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
): void => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;

    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only image files are allowed (jpeg, jpg, png, gif, webp)"
            )
        );
    }
};

// Create multer upload instance
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
    },
    fileFilter,
});

// Single file upload
export const uploadSingle = (fieldName = "image") => {
    return upload.single(fieldName);
};

// Multiple files upload
export const uploadMultiple = (
    fieldName = "images",
    maxCount = 10
) => {
    return upload.array(fieldName, maxCount);
};

// Multiple fields upload
export const uploadFields = (
    fields: { name: string; maxCount: number }[]
) => {
    return upload.fields(fields);
};

// Error handling middleware
export const handleMulterError = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message:
                    "File size is too large. Maximum size is 5MB per file.",
            });
        }

        if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                success: false,
                message:
                    "Too many files. Maximum allowed is 10 files.",
            });
        }

        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    next();
};

export default upload;
