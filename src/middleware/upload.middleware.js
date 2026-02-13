import multer from "multer";
import path from "path";

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
    }
};

// Create multer upload instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
    },
    fileFilter: fileFilter,
});

/**
 * Middleware for single file upload
 * @param {string} fieldName - The name of the file input field
 */
export const uploadSingle = (fieldName = "image") => {
    return upload.single(fieldName);
};

/**
 * Middleware for multiple files upload
 * @param {string} fieldName - The name of the file input field
 * @param {number} maxCount - Maximum number of files allowed
 */
export const uploadMultiple = (fieldName = "images", maxCount = 10) => {
    return upload.array(fieldName, maxCount);
};

/**
 * Middleware for multiple fields with files
 * @param {Array<{name: string, maxCount: number}>} fields - Array of field configurations
 */
export const uploadFields = (fields) => {
    return upload.fields(fields);
};

// Error handling middleware for multer
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File size is too large. Maximum size is 5MB per file.",
            });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                success: false,
                message: "Too many files. Maximum allowed is 10 files.",
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    next();
};

export default upload;