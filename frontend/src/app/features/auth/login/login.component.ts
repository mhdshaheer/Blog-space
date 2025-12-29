import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  isSubmitted = false;

  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  private getApiErrorMessage(err: any): string {
    const apiErrors: Array<{ msg?: string }> | undefined = err?.error?.errors;
    if (Array.isArray(apiErrors) && apiErrors.length > 0) {
      const msg = apiErrors
        .map(e => e?.msg)
        .filter(Boolean)
        .join(', ');
      if (msg) return msg;
    }

    return err?.error?.message || 'Something went wrong';
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.toast.success(`Welcome back, ${response.user?.username}!`);
          this.router.navigate(['/']);
        } else {
          this.toast.error(response.message || 'Login failed');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.toast.error(this.getApiErrorMessage(err));
        this.isLoading = false;
      }
    });
  }
}
