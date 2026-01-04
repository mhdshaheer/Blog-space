import { Request, Response, NextFunction } from 'express';
import { IAuthController } from '../interfaces/IAuthController';
import { IAuthService } from '../../services/interfaces/IAuthService';
/**
 * Auth Controller Implementation
 * Implements IAuthController interface
 * Handles HTTP requests for authentication
 * Following Single Responsibility and Dependency Inversion Principles
 */
export declare class AuthController implements IAuthController {
    private _authService;
    constructor(authService: IAuthService);
    /**
     * Handle user registration
     * POST /api/auth/register
     */
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Handle user login
     * POST /api/auth/login
     */
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Handle OTP verification
     * POST /api/auth/verify-otp
     */
    verifyOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Handle resending OTP
     * POST /api/auth/resend-otp
     */
    resendOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map