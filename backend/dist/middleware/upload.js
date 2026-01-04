"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (_req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = crypto_1.default.randomBytes(16).toString('hex');
        const ext = path_1.default.extname(file.originalname);
        cb(null, `blog-${Date.now()}-${uniqueSuffix}${ext}`);
    }
});
// File filter to allow only images
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
        cb(new Error('Invalid file type. Only JPEG, PNG and GIF images are allowed'));
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