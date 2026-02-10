import { IUser } from '../../models/User';

export interface LoginResponse {
  token: string;
  user: Partial<IUser>;
}

export interface TokenPayload {
  userId: string;
  username: string;
  email: string;
}

/**
 * Auth Service Interface
 * Defines authentication business logic contract
 * Following Interface Segregation Principle (ISP)
 */
export interface IAuthService {
  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Created user (without password)
   */
  registerUser(userData: Partial<IUser>): Promise<Partial<IUser>>;

  /**
   * Authenticate user and generate token
   * @param email - User email
   * @param password - User password
   * @returns Token and user data
   */
  loginUser(email: string, password: string): Promise<LoginResponse>;

  /**
   * Validate JWT token
   * @param token - JWT token
   * @returns Decoded token payload
   */
  validateToken(token: string): Promise<TokenPayload>;

  /**
   * Get user by ID
   * @param userId - User ID
   * @returns User data (without password)
   */
  getUserById(userId: string): Promise<Partial<IUser> | null>;

  /**
   * Verify user's OTP
   * @param email - User email
   * @param otp - One-time password
   * @returns Successful login response
   */
  verifyOtp(email: string, otp: string): Promise<LoginResponse>;

  /**
   * Resend verification OTP
   * @param email - User email
   */
  resendOtp(email: string): Promise<void>;

  /**
   * Request password reset OTP
   * @param email - User email
   */
  forgotPassword(email: string): Promise<void>;

  /**
   * Verify password reset OTP
   * @param email - User email
   * @param otp - Verification code
   */
  verifyResetOtp(email: string, otp: string): Promise<void>;

  /**
   * Reset password with OTP session
   * @param email - User email
   * @param otp - Verified OTP
   * @param newPassword - New password string
   */
  resetPassword(email: string, otp: string, newPassword: string): Promise<void>;
}
