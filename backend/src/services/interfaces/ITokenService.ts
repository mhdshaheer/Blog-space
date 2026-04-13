import { TokenPayload } from './IAuthService';

export interface ITokenService {
  generateToken(payload: TokenPayload, expiresIn?: string): string;
  verifyToken(token: string): TokenPayload;
}
