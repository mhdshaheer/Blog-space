import { Request, Response, NextFunction } from 'express';
/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user information to request
 */
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map