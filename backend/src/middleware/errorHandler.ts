import { Request, Response, NextFunction } from 'express';

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
  let statusCode = 500;
  let message = err.message || 'Internal server error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    // @ts-ignore
    message = Object.values(err.errors).map((val: any) => val.message).join(', ');
  } 
  // Mongoose duplicate key
  else if ((err as any).code === 11000) {
    statusCode = 400;
    const field = Object.keys((err as any).keyPattern)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }
  // Custom errors or other known errors
  else if (err.message.includes('not found')) {
    statusCode = 404;
  } else if (err.message.includes('Unauthorized') || err.message.includes('already exists')) {
    statusCode = 403;
  } else if (err.message.includes('required') || err.message.includes('Invalid') || err.message.includes('must be')) {
    statusCode = 400;
  } else if (err.message.includes('credentials')) {
    statusCode = 401;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
