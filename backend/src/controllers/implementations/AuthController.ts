import { Request, Response, NextFunction } from 'express';
import { IAuthController } from '../interfaces/IAuthController';
import { IAuthService } from '../../services/interfaces/IAuthService';
import { validationResult } from 'express-validator';
import { HttpStatus } from '../../enums/HttpStatus';
import { AUTH_MESSAGES } from '../../constants/Messages';
import { LoginRequestDto, RegisterRequestDto, VerifyOtpRequestDto, ResetPasswordRequestDto } from '../../dtos/AuthDto';

/**
 * Auth Controller Implementation
 */
export class AuthController implements IAuthController {
  private _authService: IAuthService;

  constructor(authService: IAuthService) {
    this._authService = authService;
  }

  /**
   * Handle user registration
   */
   register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
        return;
      }

      const registerData: RegisterRequestDto = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      };

      const user = await this._authService.registerUser(registerData);

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
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
        return;
      }

      const loginData: LoginRequestDto = {
        email: req.body.email,
        password: req.body.password
      };

      const result = await this._authService.loginUser(loginData);

      res.status(HttpStatus.OK).json({
        success: true,
        message: AUTH_MESSAGES.LOGIN_SUCCESS,
        token: result.token,
        user: result.user
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle OTP verification
   */
  verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const verifyData: VerifyOtpRequestDto = {
        email: req.body.email,
        otp: req.body.otp
      };
      
      const result = await this._authService.verifyOtp(verifyData.email, verifyData.otp);

      res.status(HttpStatus.OK).json({
        success: true,
        message: AUTH_MESSAGES.EMAIL_VERIFIED,
        token: result.token,
        user: result.user
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle resending OTP
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

  /**
   * Handle forgot password request
   */
  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: AUTH_MESSAGES.EMAIL_REQUIRED });
        return;
      }

      await this._authService.forgotPassword(email);

      res.status(HttpStatus.OK).json({
        success: true,
        message: AUTH_MESSAGES.RESET_OTP_SENT
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle verify reset OTP request
   */
  verifyResetOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: AUTH_MESSAGES.EMAIL_OTP_REQUIRED });
        return;
      }

      await this._authService.verifyResetOtp(email, otp);

      res.status(HttpStatus.OK).json({
        success: true,
        message: AUTH_MESSAGES.OTP_VERIFIED_SUCCESS
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle reset password request
   */
  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resetData: ResetPasswordRequestDto = {
        email: req.body.email,
        otp: req.body.otp,
        newPassword: req.body.newPassword
      };

      await this._authService.resetPassword(resetData.email, resetData.otp, resetData.newPassword);

      res.status(HttpStatus.OK).json({
        success: true,
        message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS
      });
    } catch (error) {
      next(error);
    }
  };
}
