import { Request, Response, NextFunction } from 'express';
import { IAuthController } from '../interfaces/IAuthController';
import { IAuthService } from '../../services/interfaces/IAuthService';
import { validationResult } from 'express-validator';

/**
 * Auth Controller Implementation
 * Implements IAuthController interface
 * Handles HTTP requests for authentication
 * Following Single Responsibility and Dependency Inversion Principles
 */
export class AuthController implements IAuthController {
  private _authService: IAuthService;

  constructor(authService: IAuthService) {
    this._authService = authService;
  }

  /**
   * Handle user registration
   * POST /api/auth/register
   */
   register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { username, email, password } = req.body;

      // Call service
      const user = await this._authService.registerUser({ username, email, password });

      // Send response
      res.status(201).json({
        success: true,
        message: 'Registration initiated. Please check your email for verification code.',
        user
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle user login
   * POST /api/auth/login
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;

      // Call service
      const result = await this._authService.loginUser(email, password);

      // Send response
      res.status(200).json({
        success: true,
        message: 'Login successful',
        ...result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle OTP verification
   * POST /api/auth/verify-otp
   */
  verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, otp } = req.body;
      const result = await this._authService.verifyOtp(email, otp);

      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        ...result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle resending OTP
   * POST /api/auth/resend-otp
   */
  resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      await this._authService.resendOtp(email);

      res.status(200).json({
        success: true,
        message: 'New verification code sent to your email'
      });
    } catch (error) {
      next(error);
    }
  };
}
