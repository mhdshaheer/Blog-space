import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse, ResetPasswordRequest } from '../models/auth.model';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _apiUrl = `${environment.apiUrl}/auth`;
  
  // Modern signal-based state management
  private readonly _currentUser = signal<User | null>(null);
  
  // Public readonly signals using computed for compatibility
  readonly currentUser = computed(() => this._currentUser());
  readonly isAuthenticated = computed(() => !!this.getToken() && !!this.currentUser());

  constructor(private _http: HttpClient, private _router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userJson && token) {
      try {
        this._currentUser.set(JSON.parse(userJson));
      } catch {
        // Clear invalid data
        this.clearAuthData();
      }
    }
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(`${this._apiUrl}/register`, data);
  }

  verifyOtp(email: string, otp: string): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(`${this._apiUrl}/verify-otp`, { email, otp }).pipe(
      tap(response => {
        if (response.success && response.token && response.user) {
          this.setAuthData(response.token, response.user);
        }
      })
    );
  }

  resendOtp(email: string): Observable<{ success: boolean; message: string }> {
    return this._http.post<{ success: boolean; message: string }>(`${this._apiUrl}/resend-otp`, { email });
  }

  private setAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this._currentUser.set(user);
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._currentUser.set(null);
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(`${this._apiUrl}/login`, data).pipe(
      tap(response => {
        if (response.success && response.token && response.user) {
          this.setAuthData(response.token, response.user);
        }
      })
    );
  }

  logout(): void {
    this.clearAuthData();
    this._router.navigate(['/login']);
  }

  forgotPassword(email: string): Observable<{ success: boolean; message: string }> {
    return this._http.post<{ success: boolean; message: string }>(`${this._apiUrl}/forgot-password`, { email });
  }

  verifyResetOtp(email: string, otp: string): Observable<{ success: boolean; message: string }> {
    return this._http.post<{ success: boolean; message: string }>(`${this._apiUrl}/verify-reset-otp`, { email, otp });
  }

  resetPassword(data: ResetPasswordRequest): Observable<{ success: boolean; message: string }> {
    return this._http.post<{ success: boolean; message: string }>(`${this._apiUrl}/reset-password`, data);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }
}
