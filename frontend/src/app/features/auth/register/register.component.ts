import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  // Inject dependencies
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _toast = inject(ToastService);
  private readonly _destroyRef = inject(DestroyRef);

  // Forms
  readonly registerForm: FormGroup = this._fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  readonly otpForm: FormGroup = this._fb.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  // Signal-based state
  readonly isLoading = signal(false);
  readonly isSubmitted = signal(false);
  readonly isOtpSubmitted = signal(false);
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly showOtpStep = signal(false);
  readonly registeredEmail = signal('');

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  private getApiErrorMessage(err: any, fallback: string): string {
    const apiErrors: Array<{ msg?: string }> | undefined = err?.error?.errors;
    if (Array.isArray(apiErrors) && apiErrors.length > 0) {
      const msg = apiErrors
        .map(e => e?.msg)
        .filter(Boolean)
        .join(', ');
      if (msg) return msg;
    }

    return err?.error?.message || fallback;
  }

  onSubmit(): void {
    this.isSubmitted.set(true);
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const { username, email, password } = this.registerForm.value;
    this.registeredEmail.set(email);

    this._authService.register({ username, email, password })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.showOtpStep.set(true);
            this._toast.success(response.message || 'Verification code sent to your email');
          } else {
            this._toast.error(response.message || 'Registration failed');
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          this._toast.error(this.getApiErrorMessage(err, 'Something went wrong'));
          this.isLoading.set(false);
        }
      });
  }

  onVerifyOtp(): void {
    this.isOtpSubmitted.set(true);
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const { otp } = this.otpForm.value;

    this._authService.verifyOtp(this.registeredEmail(), otp)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this._toast.success('Registration successful! Welcome aboard.');
            this._router.navigate(['/']);
          } else {
            this._toast.error(response.message || 'Verification failed');
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          this._toast.error(this.getApiErrorMessage(err, 'Invalid or expired OTP'));
          this.isLoading.set(false);
        }
      });
  }

  onResendOtp(): void {
    this.isLoading.set(true);

    this._authService.resendOtp(this.registeredEmail())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this._toast.success('New verification code sent!');
          } else {
            this._toast.error('Failed to resend OTP');
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          this._toast.error(this.getApiErrorMessage(err, 'Failed to resend code'));
          this.isLoading.set(false);
        }
      });
  }
}
