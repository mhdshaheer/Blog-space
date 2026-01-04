import { Router } from 'express';
import { container } from '../di/container';
import { registerValidation, loginValidation } from '../validators/authValidator';

/**
 * Authentication Routes
 * Handles user registration and login
 */
const router = Router();
const authController = container.getAuthController();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login', loginValidation, authController.login);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify user email with OTP
 * @access  Public
 */
router.post('/verify-otp', authController.verifyOtp);

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Resend verification OTP
 * @access  Public
 */
router.post('/resend-otp', authController.resendOtp);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset OTP
 * @access  Public
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route   POST /api/auth/verify-reset-otp
 * @desc    Verify password reset OTP
 * @access  Public
 */
router.post('/verify-reset-otp', authController.verifyResetOtp);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with OTP
 * @access  Public
 */
router.post('/reset-password', authController.resetPassword);

export default router;
