/**
 * Request DTO for user login
 */
export interface LoginRequestDto {
  email: string;
  password: string;
}

/**
 * Request DTO for user registration
 */
export interface RegisterRequestDto {
  username: string;
  email: string;
  password: string;
}

/**
 * Request DTO for OTP verification
 */
export interface VerifyOtpRequestDto {
  email: string;
  otp: string;
}

/**
 * Request DTO for password reset
 */
export interface ResetPasswordRequestDto {
  email: string;
  otp: string;
  newPassword: string;
}
