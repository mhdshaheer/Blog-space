import { IAuthService, LoginResponse, TokenPayload } from '../interfaces/IAuthService';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IUser } from '../../models/User';
/**
 * Auth Service Implementation
 */
export declare class AuthService implements IAuthService {
    private _userRepository;
    constructor(userRepository: IUserRepository);
    private generateOTP;
    registerUser(userData: Partial<IUser>): Promise<Partial<IUser>>;
    loginUser(email: string, password: string): Promise<LoginResponse>;
    verifyOtp(email: string, otp: string): Promise<LoginResponse>;
    resendOtp(email: string): Promise<void>;
    validateToken(token: string): Promise<TokenPayload>;
    getUserById(userId: string): Promise<Partial<IUser> | null>;
    forgotPassword(email: string): Promise<void>;
    verifyResetOtp(email: string, otp: string): Promise<void>;
    resetPassword(email: string, otp: string, newPassword: string): Promise<void>;
}
//# sourceMappingURL=AuthService.d.ts.map