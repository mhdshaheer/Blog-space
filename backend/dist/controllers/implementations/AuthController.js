"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_validator_1 = require("express-validator");
/**
 * Auth Controller Implementation
 * Implements IAuthController interface
 * Handles HTTP requests for authentication
 * Following Single Responsibility and Dependency Inversion Principles
 */
class AuthController {
    constructor(authService) {
        /**
         * Handle user registration
         * POST /api/auth/register
         */
        this.register = async (req, res, next) => {
            try {
                // Validate request
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({ errors: errors.array() });
                    return;
                }
                const { username, email, password } = req.body;
                // Call service
                const user = await this._authService.registerUser({ username, email, password });
                // Send response
                res.status(201).json({
                    success: true,
                    message: 'Registration initiated. Please check your email for verification code.',
                    user
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Handle user login
         * POST /api/auth/login
         */
        this.login = async (req, res, next) => {
            try {
                // Validate request
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({ errors: errors.array() });
                    return;
                }
                const { email, password } = req.body;
                // Call service
                const result = await this._authService.loginUser(email, password);
                // Send response
                res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    ...result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Handle OTP verification
         * POST /api/auth/verify-otp
         */
        this.verifyOtp = async (req, res, next) => {
            try {
                const { email, otp } = req.body;
                const result = await this._authService.verifyOtp(email, otp);
                res.status(200).json({
                    success: true,
                    message: 'Email verified successfully',
                    ...result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Handle resending OTP
         * POST /api/auth/resend-otp
         */
        this.resendOtp = async (req, res, next) => {
            try {
                const { email } = req.body;
                await this._authService.resendOtp(email);
                res.status(200).json({
                    success: true,
                    message: 'New verification code sent to your email'
                });
            }
            catch (error) {
                next(error);
            }
        };
        this._authService = authService;
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map