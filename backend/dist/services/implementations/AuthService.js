"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const Messages_1 = require("../../constants/Messages");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../../utils/email");
const redis_1 = require("../../utils/redis");
/**
 * Auth Service Implementation
 */
class AuthService {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async registerUser(userData) {
        const { username, email, password } = userData;
        if (!username || !email || !password) {
            throw new Error(Messages_1.AUTH_MESSAGES.REQUIRED_FIELDS);
        }
        // Check if user already exists in permanent DB
        const existingUser = await this._userRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error(Messages_1.AUTH_MESSAGES.EMAIL_EXISTS);
        }
        const otp = this.generateOTP();
        const pendingUserData = { username, email, password, otp };
        // Store in Cloud Redis (Auto-expires after 10 mins)
        try {
            await redis_1.redisClient.setEx(`registration:${email}`, 600, // 10 minutes
            JSON.stringify(pendingUserData));
        }
        catch (error) {
            throw new Error(Messages_1.AUTH_MESSAGES.INTERNAL_ERROR);
        }
        // Send Verification Email
        try {
            await (0, email_1.sendEmail)({
                email,
                subject: 'Verify your account',
                message: `Your verification code is ${otp}. It will expire in 10 minutes.`
            });
        }
        catch (error) {
            // Email sending failed silently
        }
        return { username, email };
    }
    async loginUser(email, password) {
        if (!email || !password) {
            throw new Error(Messages_1.AUTH_MESSAGES.CREDENTIALS_REQUIRED);
        }
        const user = await this._userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error(Messages_1.AUTH_MESSAGES.INVALID_CREDENTIALS);
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error(Messages_1.AUTH_MESSAGES.INVALID_CREDENTIALS);
        }
        const payload = {
            userId: user._id.toString(),
            username: user.username,
            email: user.email
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: (process.env.JWT_EXPIRE || '24h')
        });
        const userObj = user.toObject();
        delete userObj.password;
        return { token, user: userObj };
    }
    async verifyOtp(email, otp) {
        // Find pending registration from Redis
        const pendingData = await redis_1.redisClient.get(`registration:${email}`);
        if (!pendingData) {
            throw new Error(Messages_1.AUTH_MESSAGES.SESSION_EXPIRED);
        }
        const pending = JSON.parse(pendingData);
        if (pending.otp !== otp) {
            throw new Error(Messages_1.AUTH_MESSAGES.INVALID_OTP);
        }
        // Create permanent user
        const user = await this._userRepository.createUser({
            username: pending.username,
            email: pending.email,
            password: pending.password,
            isVerified: true
        });
        // Delete pending record from Redis
        await redis_1.redisClient.del(`registration:${email}`);
        const payload = {
            userId: user._id.toString(),
            username: user.username,
            email: user.email
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: (process.env.JWT_EXPIRE || '24h')
        });
        const userObj = user.toObject();
        delete userObj.password;
        return { token, user: userObj };
    }
    async resendOtp(email) {
        const pendingData = await redis_1.redisClient.get(`registration:${email}`);
        if (!pendingData) {
            const user = await this._userRepository.findUserByEmail(email);
            if (user)
                throw new Error(Messages_1.AUTH_MESSAGES.ALREADY_VERIFIED);
            throw new Error(Messages_1.AUTH_MESSAGES.SESSION_EXPIRED);
        }
        const pending = JSON.parse(pendingData);
        const otp = this.generateOTP();
        // Update Redis with new OTP and reset TTL
        pending.otp = otp;
        await redis_1.redisClient.setEx(`registration:${email}`, 600, JSON.stringify(pending));
        await (0, email_1.sendEmail)({
            email,
            subject: 'Your new verification code',
            message: `Your new verification code is ${otp}. It will expire in 10 minutes.`
        });
    }
    async validateToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (error) {
            throw new Error(Messages_1.AUTH_MESSAGES.INVALID_TOKEN);
        }
    }
    async getUserById(userId) {
        const user = await this._userRepository.findUserById(userId);
        if (!user)
            return null;
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    }
    async forgotPassword(email) {
        const user = await this._userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error(Messages_1.AUTH_MESSAGES.USER_NOT_FOUND);
        }
        const otp = this.generateOTP();
        // Store in Redis (10 minutes)
        await redis_1.redisClient.setEx(`password-reset:${email}`, 600, otp);
        await (0, email_1.sendEmail)({
            email,
            subject: 'Password Reset Request',
            message: `Your password reset code is ${otp}. It will expire in 10 minutes.`
        });
    }
    async verifyResetOtp(email, otp) {
        const storedOtp = await redis_1.redisClient.get(`password-reset:${email}`);
        if (!storedOtp) {
            throw new Error(Messages_1.AUTH_MESSAGES.RESET_SESSION_EXPIRED);
        }
        if (storedOtp !== otp) {
            throw new Error(Messages_1.AUTH_MESSAGES.INVALID_OTP);
        }
        // OTP is valid, but we don't delete it yet. 
        // It's needed for the final password reset step for verification.
    }
    async resetPassword(email, otp, newPassword) {
        const storedOtp = await redis_1.redisClient.get(`password-reset:${email}`);
        if (!storedOtp) {
            throw new Error(Messages_1.AUTH_MESSAGES.RESET_SESSION_EXPIRED);
        }
        if (storedOtp !== otp) {
            throw new Error(Messages_1.AUTH_MESSAGES.INVALID_OTP);
        }
        const user = await this._userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error(Messages_1.AUTH_MESSAGES.USER_NOT_FOUND);
        }
        // Update password using the model directly to ensure 'pre-save' hook runs
        user.password = newPassword;
        await user.save();
        // Delete reset code from Redis
        await redis_1.redisClient.del(`password-reset:${email}`);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map