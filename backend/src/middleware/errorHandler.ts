import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../enums/HttpStatus';
import { SYSTEM_MESSAGES } from '../constants/Messages';

/**
 * Global Error Handler Middleware
 * Handles all errors and sends appropriate responses
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error for debugging
  console.error('\x1b[31m[ERROR HANDLER] ', err.message, '\x1b[0m');

  // Default error
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || SYSTEM_MESSAGES.INTERNAL_SERVER_ERROR;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = HttpStatus.BAD_REQUEST;
    const validationErrors = (err as unknown as { errors?: Record<string, { message: string }> }).errors;
    if (validationErrors) {
      message = Object.values(validationErrors).map(val => val.message).join(', ');
    }
  } 
  // Mongoose duplicate key
  else if ((err as { code?: number }).code === 11000) {
    statusCode = HttpStatus.BAD_REQUEST;
    const mongoError = err as unknown as { keyPattern: Record<string, number> };
    const field = Object.keys(mongoError.keyPattern)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }
  // Custom errors or other known errors
  else if (err.message.includes('not found')) {
    statusCode = HttpStatus.NOT_FOUND;
  } else if (err.message.includes('Unauthorized') || err.message.includes('already exists')) {
    statusCode = HttpStatus.FORBIDDEN;
  } else if (err.message.includes('required') || err.message.includes('Invalid') || err.message.includes('must be')) {
    statusCode = HttpStatus.BAD_REQUEST;
  } else if (err.message.includes('credentials')) {
    statusCode = HttpStatus.UNAUTHORIZED;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
