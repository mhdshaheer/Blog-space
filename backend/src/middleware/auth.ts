import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  username: string;
  email: string;
}

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
      res.status(401).json({ message: 'No token provided' });
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
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error in authentication' });
  }
};
