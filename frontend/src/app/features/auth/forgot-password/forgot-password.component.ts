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
  resetForm: FormGroup;
  
  isLoading = signal(false);
  isSubmitted = signal(false);
  showResetForm = signal(false);

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _toast: ToastService,
    private _router: Router
  ) {
    this.forgotForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
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
        this.resetForm.patchValue({ email });
        this.showResetForm.set(true);
      },
      error: (err) => {
        this.isLoading.set(false);
        this._toast.show(err.error?.message || 'Failed to request reset code', 'error');
      }
    });
  }

  onResetPassword(): void {
    this.isSubmitted.set(true);
    if (this.resetForm.invalid) return;

    this.isLoading.set(true);
    
    this._authService.resetPassword(this.resetForm.value).subscribe({
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
