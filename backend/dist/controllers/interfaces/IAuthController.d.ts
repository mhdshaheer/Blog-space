import { Request, Response, NextFunction } from 'express';
/**
 * Auth Controller Interface
 * Defines HTTP handler contract for authentication
 * Following Interface Segregation Principle (ISP)
 */
export interface IAuthController {
    /**
     * Handle user registration
     * @param req - Express request
     * @param res - Express response
     * @param next - Express next function
     */
    register(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Handle user login
     * @param req - Express request
     * @param res - Express response
     * @param next - Express next function
     */
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Handle OTP verification
     */
    verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Handle resending OTP
     */
    resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Handle forgot password request
     */
    forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Handle reset password request
     */
    resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=IAuthController.d.ts.map