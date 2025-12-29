import { IAuthService, LoginResponse, TokenPayload } from '../interfaces/IAuthService';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IUser } from '../../models/User';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/email';
import { redisClient } from '../../utils/redis';

/**
 * Auth Service Implementation
 */
export class AuthService implements IAuthService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async registerUser(userData: Partial<IUser>): Promise<Partial<IUser>> {
    const { username, email, password } = userData;

    if (!username || !email || !password) {
      throw new Error('Username, email, and password are required');
    }

    // Check if user already exists in permanent DB
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
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
      throw new Error('Internal server error during registration');
    }

    // Send Verification Email
    try {
      await sendEmail({
        email,
        subject: 'Verify your account',
        message: `Your verification code is ${otp}. It will expire in 10 minutes.`
      });
    } catch (error) {
      // Email sending failed silently
    }

    return { username, email };
  }

  async loginUser(email: string, password: string): Promise<LoginResponse> {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const payload: TokenPayload = {
      userId: (user._id as any).toString(),
      username: user.username,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: (process.env.JWT_EXPIRE || '24h') as any
    });

    const userObj = user.toObject();
    delete userObj.password;
    
    return { token, user: userObj };
  }

  async verifyOtp(email: string, otp: string): Promise<LoginResponse> {
    // Find pending registration from Redis
    const pendingData = await redisClient.get(`registration:${email}`);
    
    if (!pendingData) {
      throw new Error('Registration session expired or not found. Please register again.');
    }

    const pending = JSON.parse(pendingData);

    if (pending.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    // Create permanent user
    const user = await this.userRepository.createUser({
      username: pending.username,
      email: pending.email,
      password: pending.password,
      isVerified: true
    });

    // Delete pending record from Redis
    await redisClient.del(`registration:${email}`);

    const payload: TokenPayload = {
      userId: (user._id as any).toString(),
      username: user.username,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: (process.env.JWT_EXPIRE || '24h') as any
    });

    const userObj = user.toObject();
    delete userObj.password;

    return { token, user: userObj };
  }

  async resendOtp(email: string): Promise<void> {
    const pendingData = await redisClient.get(`registration:${email}`);
    
    if (!pendingData) {
      const user = await this.userRepository.findUserByEmail(email);
      if (user) throw new Error('User is already verified');
      throw new Error('Registration session expired. Please register again.');
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
      subject: 'Your new verification code',
      message: `Your new verification code is ${otp}. It will expire in 10 minutes.`
    });
  }

  async validateToken(token: string): Promise<TokenPayload> {
    try {
      return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async getUserById(userId: string): Promise<Partial<IUser> | null> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) return null;
    
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }
}

