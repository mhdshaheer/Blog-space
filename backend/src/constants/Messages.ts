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
  INVALID_TOKEN: 'Invalid or expired token'
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
  UNAUTHORIZED_DELETE: 'Unauthorized: You can only delete your own blogs'
};
