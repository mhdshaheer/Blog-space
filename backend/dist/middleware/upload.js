"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// Configure Cloudinary storage
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: {
        folder: 'blog-space/blogs',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
        public_id: (_req, _file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            return `blog-${uniqueSuffix}`;
        }
    },
});
// File filter to allow only images (optional but good for extra safety)
const fileFilter = (_req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only JPEG, PNG and GIF images are allowed'), false);
    }
};
// Configure multer
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB default
    },
    fileFilter: fileFilter
});
//# sourceMappingURL=upload.js.map