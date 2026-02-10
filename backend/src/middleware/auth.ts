import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpStatus } from '../enums/HttpStatus';
import { AUTH_MESSAGES } from '../constants/Messages';
import { TokenPayload } from '../services/interfaces/IAuthService';

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user information to request
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: AUTH_MESSAGES.NO_TOKEN });
      return;
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
      
      // Attach user to request
      req.user = {
        userId: decoded.userId,
        username: decoded.username,
        email: decoded.email
      };

      next();
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: AUTH_MESSAGES.INVALID_TOKEN });
      return;
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: AUTH_MESSAGES.AUTH_SERVER_ERROR });
  }
};
