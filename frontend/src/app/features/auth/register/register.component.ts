import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;
  otpForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  showOtpStep = false;
  registeredEmail = '';


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;

    const { username, email, password } = this.registerForm.value;
    this.registeredEmail = email;

    this.authService.register({ username, email, password }).subscribe({
      next: (response) => {
        if (response.success) {
          this.showOtpStep = true;
          this.toast.success(response.message || 'Verification code sent to your email');
        } else {
          this.toast.error(response.message || 'Registration failed');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Something went wrong');
        this.isLoading = false;
      }
    });
  }

  onVerifyOtp(): void {
    if (this.otpForm.invalid) return;

    this.isLoading = true;

    const { otp } = this.otpForm.value;

    this.authService.verifyOtp(this.registeredEmail, otp).subscribe({
      next: (response) => {
        if (response.success) {
          this.toast.success('Registration successful! Welcome aboard.');
          this.router.navigate(['/']);
        } else {
          this.toast.error(response.message || 'Verification failed');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Invalid or expired OTP');
        this.isLoading = false;
      }
    });
  }

  onResendOtp(): void {
    this.isLoading = true;

    this.authService.resendOtp(this.registeredEmail).subscribe({
      next: (response) => {
        if (response.success) {
          this.toast.success('New verification code sent!');
        } else {
          this.toast.error('Failed to resend OTP');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to resend code');
        this.isLoading = false;
      }
    });
  }
}
