"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
/**
 * Global Error Handler Middleware
 * Handles all errors and sends appropriate responses
 */
const errorHandler = (err, req, res, _next) => {
    // Log error for development
    if (process.env.NODE_ENV === 'development') {
        console.error(`❌ Error [${req.method} ${req.url}]:`, err.message);
    }
    // Default error
    let statusCode = 500;
    let message = err.message || 'Internal server error';
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        // @ts-ignore
        message = Object.values(err.errors).map((val) => val.message).join(', ');
    }
    // Mongoose duplicate key
    else if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyPattern)[0];
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }
    // Custom errors or other known errors
    else if (err.message.includes('not found')) {
        statusCode = 404;
    }
    else if (err.message.includes('Unauthorized') || err.message.includes('already exists')) {
        statusCode = 403;
    }
    else if (err.message.includes('required') || err.message.includes('Invalid') || err.message.includes('must be')) {
        statusCode = 400;
    }
    else if (err.message.includes('credentials')) {
        statusCode = 401;
    }
    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map