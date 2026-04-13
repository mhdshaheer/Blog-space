import * as jwt from 'jsonwebtoken';
import { ITokenService } from '../interfaces/ITokenService';
import { TokenPayload } from '../interfaces/IAuthService';

export class TokenService implements ITokenService {
  private readonly secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'secret';
  }

  generateToken(payload: TokenPayload, expiresIn: any = '24h'): string {
    return jwt.sign({ ...payload }, this.secret, { expiresIn } as jwt.SignOptions);
  }

  verifyToken(token: string): TokenPayload {
    return jwt.verify(token, this.secret) as TokenPayload;
  }
}
