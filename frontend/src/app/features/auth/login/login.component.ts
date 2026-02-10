import {
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  // Inject dependencies
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _toast = inject(ToastService);
  private readonly _destroyRef = inject(DestroyRef);

  // Form
  readonly loginForm: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });


  // Signal-based state
  readonly isLoading = signal(false);
  readonly isSubmitted = signal(false);
  readonly showPassword = signal(false);

  private getApiErrorMessage(err: HttpErrorResponse): string {
    const apiErrors: Array<{ msg?: string }> | undefined = err?.error?.errors;
    if (Array.isArray(apiErrors) && apiErrors.length > 0) {
      const msg = apiErrors
        .map((e) => e?.msg)
        .filter(Boolean)
        .join(', ');
      if (msg) return msg;
    }

    return err?.error?.message || 'Something went wrong';
  }

  onSubmit(): void {
    this.isSubmitted.set(true);
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this._authService
      .login(this.loginForm.value)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this._toast.success(`Welcome back, ${response.user?.username}!`);
            this._router.navigate(['/']);
          } else {
            this._toast.error(response.message || 'Login failed');
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          this._toast.error(this.getApiErrorMessage(err));
          this.isLoading.set(false);
        },
      });
  }
}
