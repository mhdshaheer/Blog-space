"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_validator_1 = require("express-validator");
const HttpStatus_1 = require("../../enums/HttpStatus");
const Messages_1 = require("../../constants/Messages");
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
                    res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
                    return;
                }
                const { username, email, password } = req.body;
                // Call service
                const user = await this._authService.registerUser({ username, email, password });
                // Send response
                res.status(HttpStatus_1.HttpStatus.CREATED).json({
                    success: true,
                    message: Messages_1.AUTH_MESSAGES.REGISTRATION_SUCCESS,
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
                    res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
                    return;
                }
                const { email, password } = req.body;
                // Call service
                const result = await this._authService.loginUser(email, password);
                // Send response
                res.status(HttpStatus_1.HttpStatus.OK).json({
                    success: true,
                    message: Messages_1.AUTH_MESSAGES.LOGIN_SUCCESS,
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
                res.status(HttpStatus_1.HttpStatus.OK).json({
                    success: true,
                    message: Messages_1.AUTH_MESSAGES.EMAIL_VERIFIED,
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
                res.status(HttpStatus_1.HttpStatus.OK).json({
                    success: true,
                    message: Messages_1.AUTH_MESSAGES.OTP_RESENT
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Handle forgot password request
         * POST /api/auth/forgot-password
         */
        this.forgotPassword = async (req, res, next) => {
            try {
                const { email } = req.body;
                if (!email) {
                    res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ message: 'Email is required' });
                    return;
                }
                await this._authService.forgotPassword(email);
                res.status(HttpStatus_1.HttpStatus.OK).json({
                    success: true,
                    message: Messages_1.AUTH_MESSAGES.RESET_OTP_SENT
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Handle verify reset OTP request
         * POST /api/auth/verify-reset-otp
         */
        this.verifyResetOtp = async (req, res, next) => {
            try {
                const { email, otp } = req.body;
                if (!email || !otp) {
                    res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ message: 'Email and OTP are required' });
                    return;
                }
                await this._authService.verifyResetOtp(email, otp);
                res.status(HttpStatus_1.HttpStatus.OK).json({
                    success: true,
                    message: 'OTP verified successfully'
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Handle reset password request
         * POST /api/auth/reset-password
         */
        this.resetPassword = async (req, res, next) => {
            try {
                const { email, otp, newPassword } = req.body;
                if (!email || !otp || !newPassword) {
                    res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ message: 'Email, OTP, and new password are required' });
                    return;
                }
                await this._authService.resetPassword(email, otp, newPassword);
                res.status(HttpStatus_1.HttpStatus.OK).json({
                    success: true,
                    message: Messages_1.AUTH_MESSAGES.PASSWORD_RESET_SUCCESS
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