"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../di/container");
const authValidator_1 = require("../validators/authValidator");
/**
 * Authentication Routes
 * Handles user registration and login
 */
const router = (0, express_1.Router)();
const authController = container_1.container.getAuthController();
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authValidator_1.registerValidation, authController.register);
/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login', authValidator_1.loginValidation, authController.login);
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
exports.default = router;
//# sourceMappingURL=authRoutes.js.map