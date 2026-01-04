"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
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
            throw new Error('Username, email, and password are required');
        }
        // Check if user already exists in permanent DB
        const existingUser = await this._userRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error('Email already exists');
        }
        const otp = this.generateOTP();
        const pendingUserData = { username, email, password, otp };
        // Store in Cloud Redis (Auto-expires after 10 mins)
        try {
            await redis_1.redisClient.setEx(`registration:${email}`, 600, // 10 minutes
            JSON.stringify(pendingUserData));
        }
        catch (error) {
            throw new Error('Internal server error during registration');
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
            throw new Error('Email and password are required');
        }
        const user = await this._userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
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
            throw new Error('Registration session expired or not found. Please register again.');
        }
        const pending = JSON.parse(pendingData);
        if (pending.otp !== otp) {
            throw new Error('Invalid OTP');
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
                throw new Error('User is already verified');
            throw new Error('Registration session expired. Please register again.');
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
            throw new Error('Invalid or expired token');
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
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map