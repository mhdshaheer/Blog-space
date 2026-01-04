import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BlogService } from '../../../core/services/blog.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './blog-form.component.html'
})
export class BlogFormComponent {
  // Inject dependencies
  private readonly _fb = inject(FormBuilder);
  private readonly _blogService = inject(BlogService);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _toastService = inject(ToastService);
  private readonly _destroyRef = inject(DestroyRef);

  // Form
  readonly blogForm: FormGroup = this._fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    content: ['', [Validators.required, Validators.minLength(10)]]
  });

  // Signal-based state
  readonly isEditMode = signal(false);
  readonly isLoading = signal(false);
  readonly blogId = signal<string | null>(null);
  readonly imagePreview = signal<string | ArrayBuffer | null>(null);
  readonly selectedFile = signal<File | null>(null);
  readonly error = signal('');

  constructor() {
    // Subscribe to route params with automatic cleanup
    this._route.paramMap
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.isEditMode.set(true);
          this.blogId.set(id);
          this.loadBlog(id);
        }
      });
  }

  private loadBlog(id: string): void {
    this.isLoading.set(true);
    this._blogService.getBlogById(id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success) {
            const { title, content, image, author } = response.blog;
            const currentUserId = this._authService.getCurrentUser()?._id;

            const authorId = typeof author === 'string' ? author : author?._id;
            if (this.isEditMode() && currentUserId && authorId && authorId !== currentUserId) {
              this._toastService.error('You can only edit your own blogs');
              this._router.navigate(['/my-blogs']);
              this.isLoading.set(false);
              return;
            }

            this.blogForm.patchValue({ title, content });
            this.imagePreview.set(this.getImageUrl(image));
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to load blog details');
          this.isLoading.set(false);
        }
      });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile.set(file);
      
      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.blogForm.invalid) return;
    
    if (!this.isEditMode() && !this.selectedFile()) {
      this.error.set('Please select an image');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    const formData = new FormData();
    formData.append('title', this.blogForm.get('title')?.value);
    formData.append('content', this.blogForm.get('content')?.value);
    
    const file = this.selectedFile();
    if (file) {
      formData.append('image', file);
    }

    const currentBlogId = this.blogId();
    const request = this.isEditMode() && currentBlogId
      ? this._blogService.updateBlog(currentBlogId, formData)
      : this._blogService.createBlog(formData);

    request
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this._toastService.success(this.isEditMode() ? 'Article updated!' : 'Article published!');
            this._router.navigate(['/my-blogs']);
          } else {
            const errorMsg = response.message || 'Operation failed';
            this.error.set(errorMsg);
            this._toastService.error(errorMsg);
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          const apiErrors: Array<{ msg?: string }> | undefined = err?.error?.errors;
          let errorMsg: string;
          
          if (Array.isArray(apiErrors) && apiErrors.length > 0) {
            errorMsg = apiErrors
              .map(e => e?.msg)
              .filter(Boolean)
              .join(', ');
          } else {
            errorMsg = err?.error?.message || 'Something went wrong';
          }
          
          this.error.set(errorMsg);
          this._toastService.error(errorMsg);
          this.isLoading.set(false);
        }
      });
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    return `${environment.baseUrl}${imagePath}`;
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80';
  }
}
