import { Request, Response, NextFunction } from 'express';
import { IAuthController } from '../interfaces/IAuthController';
import { IAuthService } from '../../services/interfaces/IAuthService';
import { validationResult } from 'express-validator';
import { HttpStatus } from '../../enums/HttpStatus';
import { AUTH_MESSAGES } from '../../constants/Messages';

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
        res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
        return;
      }

      const { username, email, password } = req.body;

      // Call service
      const user = await this._authService.registerUser({ username, email, password });

      // Send response
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: AUTH_MESSAGES.REGISTRATION_SUCCESS,
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
        res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;

      // Call service
      const result = await this._authService.loginUser(email, password);

      // Send response
      res.status(HttpStatus.OK).json({
        success: true,
        message: AUTH_MESSAGES.LOGIN_SUCCESS,
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

      res.status(HttpStatus.OK).json({
        success: true,
        message: AUTH_MESSAGES.EMAIL_VERIFIED,
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

      res.status(HttpStatus.OK).json({
        success: true,
        message: AUTH_MESSAGES.OTP_RESENT
      });
    } catch (error) {
      next(error);
    }
  };
}
