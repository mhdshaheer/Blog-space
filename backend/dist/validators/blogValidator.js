"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogValidation = exports.createBlogValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createBlogValidation = [
    (0, express_validator_1.body)('title')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters'),
    (0, express_validator_1.body)('content')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Content must be at least 10 characters long')
];
exports.updateBlogValidation = [
    (0, express_validator_1.body)('title')
        .optional()
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters'),
    (0, express_validator_1.body)('content')
        .optional()
        .trim()
        .isLength({ min: 10 })
        .withMessage('Content must be at least 10 characters long')
];
//# sourceMappingURL=blogValidator.js.map