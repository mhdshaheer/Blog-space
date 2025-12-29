import { User } from './user.model';

export interface LoginRequest {
  email?: string;
  password?: string;
  // Generic validation errors might map to fields
}

export interface RegisterRequest {
  username?: string;
  email?: string;
  password?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  errors?: any[];
}
