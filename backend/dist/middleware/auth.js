"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user information to request
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }
        // Extract token
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        // Verify token
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Attach user to request
            req.user = {
                userId: decoded.userId,
                username: decoded.username,
                email: decoded.email
            };
            next();
        }
        catch (error) {
            res.status(401).json({ message: 'Invalid or expired token' });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error in authentication' });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map