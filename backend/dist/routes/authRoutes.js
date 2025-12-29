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
exports.default = router;
//# sourceMappingURL=authRoutes.js.map