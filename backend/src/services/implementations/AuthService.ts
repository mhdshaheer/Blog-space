import { IAuthService, LoginResponse, TokenPayload } from '../interfaces/IAuthService';
import { AUTH_MESSAGES } from '../../constants/Messages';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IUser } from '../../models/User';
import * as jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/email';
import { redisClient } from '../../utils/redis';

/**
 * Auth Service Implementation
 */
export class AuthService implements IAuthService {
  private _userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this._userRepository = userRepository;
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async registerUser(userData: Partial<IUser>): Promise<Partial<IUser>> {
    const { username, email, password } = userData;

    if (!username || !email || !password) {
      throw new Error(AUTH_MESSAGES.REQUIRED_FIELDS);
    }

    // Check if user already exists in permanent DB
    const existingUser = await this._userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error(AUTH_MESSAGES.EMAIL_EXISTS);
    }

    const otp = this.generateOTP();
    const pendingUserData = { username, email, password, otp };

    // Store in Cloud Redis (Auto-expires after 10 mins)
    try {
      await redisClient.setEx(
        `registration:${email}`,
        600, // 10 minutes
        JSON.stringify(pendingUserData)
      );
    } catch (error) {
      throw new Error(AUTH_MESSAGES.INTERNAL_ERROR);
    }

    // Send Verification Email
    try {
      await sendEmail({
        email,
        subject: 'Account Verification | Creator Identity',
        message: `Your secure registration code is ${otp}. It will expire in 10 minutes.`
      });
    } catch (error) {
      // Email sending failed silently
    }

    return { username, email };
  }

  async loginUser(email: string, password: string): Promise<LoginResponse> {
    if (!email || !password) {
      throw new Error(AUTH_MESSAGES.CREDENTIALS_REQUIRED);
    }

    const user = await this._userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const payload: TokenPayload = {
      userId: String(user._id),
      username: user.username,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: (process.env.JWT_EXPIRE || '24h')
    } as jwt.SignOptions);

    const userObj = user.toObject();
    delete userObj.password;
    
    return { token, user: userObj };
  }

  async verifyOtp(email: string, otp: string): Promise<LoginResponse> {
    // Find pending registration from Redis
    const pendingData = await redisClient.get(`registration:${email}`);
    
    if (!pendingData) {
      throw new Error(AUTH_MESSAGES.SESSION_EXPIRED);
    }

    const pending = JSON.parse(pendingData);

    if (pending.otp !== otp) {
      throw new Error(AUTH_MESSAGES.INVALID_OTP);
    }

    // Create permanent user
    const user = await this._userRepository.createUser({
      username: pending.username,
      email: pending.email,
      password: pending.password,
      isVerified: true
    });

    // Delete pending record from Redis
    await redisClient.del(`registration:${email}`);

    const payload: TokenPayload = {
      userId: String(user._id),
      username: user.username,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: (process.env.JWT_EXPIRE || '24h')
    } as jwt.SignOptions);

    const userObj = user.toObject();
    delete userObj.password;

    return { token, user: userObj };
  }

  async resendOtp(email: string): Promise<void> {
    const pendingData = await redisClient.get(`registration:${email}`);
    
    if (!pendingData) {
      const user = await this._userRepository.findUserByEmail(email);
      if (user) throw new Error(AUTH_MESSAGES.ALREADY_VERIFIED);
      throw new Error(AUTH_MESSAGES.SESSION_EXPIRED);
    }

    const pending = JSON.parse(pendingData);
    const otp = this.generateOTP();
    
    // Update Redis with new OTP and reset TTL
    pending.otp = otp;
    await redisClient.setEx(
      `registration:${email}`,
      600,
      JSON.stringify(pending)
    );

    await sendEmail({
      email,
      subject: 'New Access Key | Verification Required',
      message: `Your new secure access code is ${otp}. It will expire in 10 minutes.`
    });
  }

  async validateToken(token: string): Promise<TokenPayload> {
    try {
      return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    } catch (error) {
      throw new Error(AUTH_MESSAGES.INVALID_TOKEN);
    }
  }

  async getUserById(userId: string): Promise<Partial<IUser> | null> {
    const user = await this._userRepository.findUserById(userId);
    if (!user) return null;
    
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this._userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const otp = this.generateOTP();

    // Store in Redis (10 minutes)
    await redisClient.setEx(
      `password-reset:${email}`,
      600,
      otp
    );

    await sendEmail({
      email,
      subject: 'Security Alert | Recovery Session Initiated',
      message: `Your private recovery code is ${otp}. It will expire in 10 minutes.`
    });
  }

  async verifyResetOtp(email: string, otp: string): Promise<void> {
    const storedOtp = await redisClient.get(`password-reset:${email}`);
    
    if (!storedOtp) {
      throw new Error(AUTH_MESSAGES.RESET_SESSION_EXPIRED);
    }

    if (storedOtp !== otp) {
      throw new Error(AUTH_MESSAGES.INVALID_OTP);
    }
    // OTP is valid, but we don't delete it yet. 
    // It's needed for the final password reset step for verification.
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    const storedOtp = await redisClient.get(`password-reset:${email}`);
    
    if (!storedOtp) {
      throw new Error(AUTH_MESSAGES.RESET_SESSION_EXPIRED);
    }

    if (storedOtp !== otp) {
      throw new Error(AUTH_MESSAGES.INVALID_OTP);
    }

    const user = await this._userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    // Update password using the model directly to ensure 'pre-save' hook runs
    user.password = newPassword;
    await user.save();

    // Delete reset code from Redis
    await redisClient.del(`password-reset:${email}`);
  }
}

