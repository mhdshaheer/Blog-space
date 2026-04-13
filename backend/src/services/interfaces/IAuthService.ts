import { UserDto } from '../../dtos/UserDto';
import { LoginRequestDto, RegisterRequestDto } from '../../dtos/AuthDto';

export interface LoginResponse {
  token: string;
  user: UserDto;
}

export interface TokenPayload {
  userId: string;
  username: string;
  email: string;
}

/**
 * Auth Service Interface
 */
export interface IAuthService {
  /**
   * Register a new user
   */
  registerUser(userData: RegisterRequestDto): Promise<UserDto>;

  /**
   * Authenticate user and generate token
   */
  loginUser(credentials: LoginRequestDto): Promise<LoginResponse>;

  /**
   * Validate JWT token
   */
  validateToken(token: string): Promise<TokenPayload>;

  /**
   * Get user by ID
   */
  getUserById(userId: string): Promise<UserDto | null>;

  /**
   * Verify user's OTP
   */
  verifyOtp(email: string, otp: string): Promise<LoginResponse>;

  /**
   * Resend verification OTP
   */
  resendOtp(email: string): Promise<void>;

  /**
   * Request password reset OTP
   */
  forgotPassword(email: string): Promise<void>;

  /**
   * Verify password reset OTP
   */
  verifyResetOtp(email: string, otp: string): Promise<void>;

  /**
   * Reset password with OTP session
   */
  resetPassword(email: string, otp: string, newPassword: string): Promise<void>;
}
