export const SYSTEM_MESSAGES = {
  SERVER_RUNNING: 'Server is running',
  ROUTE_NOT_FOUND: 'Route not found',
  RATE_LIMIT_EXCEEDED: 'Too many requests from this IP, please try again later',
  INTERNAL_SERVER_ERROR: 'Internal server error',
};

export const AUTH_MESSAGES = {
  REGISTRATION_SUCCESS: 'Registration initiated. Please check your email for verification code.',
  LOGIN_SUCCESS: 'Login successful',
  EMAIL_VERIFIED: 'Email verified successfully',
  OTP_RESENT: 'New verification code sent to your email',
  REQUIRED_FIELDS: 'Username, email, and password are required',
  EMAIL_EXISTS: 'Email already exists',
  INTERNAL_ERROR: 'Internal server error during registration',
  CREDENTIALS_REQUIRED: 'Email and password are required',
  INVALID_CREDENTIALS: 'Invalid credentials',
  SESSION_EXPIRED: 'Registration session expired or not found. Please register again.',
  INVALID_OTP: 'Invalid OTP',
  ALREADY_VERIFIED: 'User is already verified',
  INVALID_TOKEN: 'Invalid or expired token',
  RESET_OTP_SENT: 'Password reset code sent to your email',
  PASSWORD_RESET_SUCCESS: 'Password has been reset successfully',
  USER_NOT_FOUND: 'No user found with this email',
  RESET_SESSION_EXPIRED: 'Reset session expired. Please request a new code.',
  NO_TOKEN: 'No token provided',
  AUTH_SERVER_ERROR: 'Server error in authentication',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_OTP_REQUIRED: 'Email and OTP are required',
  EMAIL_OTP_PWD_REQUIRED: 'Email, OTP, and new password are required',
  OTP_VERIFIED_SUCCESS: 'OTP verified successfully'
};

export const BLOG_MESSAGES = {
  IMAGE_REQUIRED: 'Image is required',
  CREATE_SUCCESS: 'Blog created successfully',
  UPDATE_SUCCESS: 'Blog updated successfully',
  DELETE_SUCCESS: 'Blog deleted successfully',
  TITLE_REQUIRED: 'Title must be at least 5 characters',
  CONTENT_REQUIRED: 'Content must be at least 10 characters',
  AUTHOR_NOT_FOUND: 'Author not found',
  INVALID_ID: 'Invalid blog ID format',
  NOT_FOUND: 'Blog not found',
  UNAUTHORIZED_UPDATE: 'Unauthorized: You can only update your own blogs',
  UNAUTHORIZED_DELETE: 'Unauthorized: You can only delete your own blogs',
  INVALID_FILE_TYPE: 'Invalid file type. Only JPEG, PNG and GIF images are allowed'
};
