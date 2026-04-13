import { IAuthService, LoginResponse, TokenPayload } from '../interfaces/IAuthService';
import { AUTH_MESSAGES } from '../../constants/Messages';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { Mapper } from '../../utils/mapper';
import { UserDto } from '../../dtos/UserDto';
import { LoginRequestDto, RegisterRequestDto } from '../../dtos/AuthDto';
import { IMailService } from '../interfaces/IMailService';
import { ICacheService } from '../interfaces/ICacheService';
import { ITokenService } from '../interfaces/ITokenService';

/**
 * Auth Service Implementation
 * Follows SOLID principles by injecting dependencies
 */
export class AuthService implements IAuthService {
  private _userRepository: IUserRepository;
  private _mailService: IMailService;
  private _cacheService: ICacheService;
  private _tokenService: ITokenService;

  constructor(
    userRepository: IUserRepository,
    mailService: IMailService,
    cacheService: ICacheService,
    tokenService: ITokenService
  ) {
    this._userRepository = userRepository;
    this._mailService = mailService;
    this._cacheService = cacheService;
    this._tokenService = tokenService;
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private getRegistrationKey(email: string): string {
    return `registration:${email}`;
  }

  private getPasswordResetKey(email: string): string {
    return `password-reset:${email}`;
  }

  async registerUser(userData: RegisterRequestDto): Promise<UserDto> {
    const { username, email, password } = userData;

    const existingUser = await this._userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error(AUTH_MESSAGES.EMAIL_EXISTS);
    }

    const otp = this.generateOTP();
    await this._cacheService.set(this.getRegistrationKey(email), { username, email, password, otp }, 600);

    try {
      await this._mailService.sendVerificationEmail(email, otp);
    } catch (error) {
      // Log error but don't fail registration process if email fails (can be resent)
      console.error('Failed to send verification email:', error);
    }

    return {
      _id: '',
      username,
      email,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async loginUser(credentials: LoginRequestDto): Promise<LoginResponse> {
    const { email, password } = credentials;
    const user = await this._userRepository.findUserByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const payload: TokenPayload = { 
      userId: String(user._id), 
      username: user.username, 
      email: user.email 
    };
    const token = this._tokenService.generateToken(payload);

    return { token, user: Mapper.toUserDto(user) };
  }

  async verifyOtp(email: string, otp: string): Promise<LoginResponse> {
    const pending = await this._cacheService.get<any>(this.getRegistrationKey(email));
    if (!pending) throw new Error(AUTH_MESSAGES.SESSION_EXPIRED);

    if (pending.otp !== otp) throw new Error(AUTH_MESSAGES.INVALID_OTP);

    const user = await this._userRepository.createUser({
      username: pending.username,
      email: pending.email,
      password: pending.password,
      isVerified: true
    });

    await this._cacheService.delete(this.getRegistrationKey(email));
    
    const payload: TokenPayload = { 
      userId: String(user._id), 
      username: user.username, 
      email: user.email 
    };
    const token = this._tokenService.generateToken(payload);

    return { token, user: Mapper.toUserDto(user) };
  }

  async resendOtp(email: string): Promise<void> {
    const pending = await this._cacheService.get<any>(this.getRegistrationKey(email));
    if (!pending) throw new Error(AUTH_MESSAGES.SESSION_EXPIRED);

    const otp = this.generateOTP();
    pending.otp = otp;
    await this._cacheService.set(this.getRegistrationKey(email), pending, 600);

    await this._mailService.sendVerificationEmail(email, otp);
  }

  async validateToken(token: string): Promise<TokenPayload> {
    try {
      return this._tokenService.verifyToken(token);
    } catch (error) {
      throw new Error(AUTH_MESSAGES.INVALID_TOKEN);
    }
  }

  async getUserById(userId: string): Promise<UserDto | null> {
    const user = await this._userRepository.findUserById(userId);
    return user ? Mapper.toUserDto(user) : null;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this._userRepository.findUserByEmail(email);
    if (!user) throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);

    const otp = this.generateOTP();
    await this._cacheService.set(this.getPasswordResetKey(email), otp, 600);

    await this._mailService.sendPasswordResetEmail(email, otp);
  }

  async verifyResetOtp(email: string, otp: string): Promise<void> {
    const storedOtp = await this._cacheService.get<string>(this.getPasswordResetKey(email));
    if (!storedOtp || storedOtp !== otp) throw new Error(AUTH_MESSAGES.INVALID_OTP);
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    const storedOtp = await this._cacheService.get<string>(this.getPasswordResetKey(email));
    if (!storedOtp || storedOtp !== otp) throw new Error(AUTH_MESSAGES.INVALID_OTP);

    const user = await this._userRepository.findUserByEmail(email);
    if (!user) throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);

    user.password = newPassword;
    await user.save();
    await this._cacheService.delete(this.getPasswordResetKey(email));
  }
}

