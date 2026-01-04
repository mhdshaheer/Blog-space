import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  otpForm: FormGroup;
  passwordForm: FormGroup;
  
  isLoading = signal(false);
  isSubmitted = signal(false);
  currentStep = signal(1); // 1: Email, 2: OTP, 3: Password

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _toast: ToastService,
    private _router: Router
  ) {
    this.forgotForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this._fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    this.passwordForm = this._fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onRequestOtp(): void {
    this.isSubmitted.set(true);
    if (this.forgotForm.invalid) return;

    this.isLoading.set(true);
    const email = this.forgotForm.get('email')?.value;

    this._authService.forgotPassword(email).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.isSubmitted.set(false);
        this._toast.show(res.message, 'success');
        this.currentStep.set(2);
      },
      error: (err) => {
        this.isLoading.set(false);
        this._toast.show(err.error?.message || 'Failed to request reset code', 'error');
      }
    });
  }

  onVerifyOtp(): void {
    this.isSubmitted.set(true);
    if (this.otpForm.invalid) return;

    this.isLoading.set(true);
    const email = this.forgotForm.get('email')?.value;
    const otp = this.otpForm.get('otp')?.value;

    this._authService.verifyResetOtp(email, otp).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.isSubmitted.set(false);
        this._toast.show(res.message, 'success');
        this.currentStep.set(3);
      },
      error: (err) => {
        this.isLoading.set(false);
        this._toast.show(err.error?.message || 'Invalid verification code', 'error');
      }
    });
  }

  onResetPassword(): void {
    this.isSubmitted.set(true);
    if (this.passwordForm.invalid) return;

    this.isLoading.set(true);
    const payload = {
      email: this.forgotForm.get('email')?.value,
      otp: this.otpForm.get('otp')?.value,
      newPassword: this.passwordForm.get('newPassword')?.value
    };
    
    this._authService.resetPassword(payload).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this._toast.show(res.message, 'success');
        this._router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this._toast.show(err.error?.message || 'Failed to reset password', 'error');
      }
    });
  }
}
