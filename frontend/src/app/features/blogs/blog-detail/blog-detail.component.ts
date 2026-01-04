import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for DatePipe and NgClass
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BlogService } from '../../../core/services/blog.service';
import { Blog } from '../../../core/models/blog.model';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-detail.component.html'
})
export class BlogDetailComponent {
  // Inject dependencies using modern inject() function
  private readonly _route = inject(ActivatedRoute);
  private readonly _blogService = inject(BlogService);
  private readonly _authService = inject(AuthService);
  private readonly _toast = inject(ToastService);
  private readonly _destroyRef = inject(DestroyRef);

  // Signal-based state
  readonly blog = signal<Blog | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal('');

  constructor() {
    // Subscribe to route params with automatic cleanup
    this._route.paramMap
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
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
            this.blog.set(response.blog);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to load blog post');
          this.isLoading.set(false);
        }
      });
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80';
    if (imagePath.startsWith('http')) return imagePath;
    return `${environment.baseUrl}${imagePath}`;
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80';
  }

  getAuthorName(blog: Blog): string {
    if (!blog.author || typeof blog.author === 'string') {
      return 'Guest Author';
    }
    return blog.author.username;
  }

  isLiked(): boolean {
    const currentBlog = this.blog();
    const currentUser = this._authService.currentUser();
    if (!currentBlog || !currentUser || !currentBlog.likes) return false;
    return currentBlog.likes.includes(currentUser._id);
  }

  isDisliked(): boolean {
    const currentBlog = this.blog();
    const currentUser = this._authService.currentUser();
    if (!currentBlog || !currentUser || !currentBlog.dislikes) return false;
    return currentBlog.dislikes.includes(currentUser._id);
  }

  isFavorited(): boolean {
    const currentBlog = this.blog();
    const currentUser = this._authService.currentUser();
    if (!currentBlog || !currentUser || !currentBlog.favorites) return false;
    return currentBlog.favorites.includes(currentUser._id);
  }

  toggleLike(): void {
    const currentBlog = this.blog();
    if (!currentBlog) return;

    if (!this._authService.isAuthenticated()) {
      this._toast.show('Please login to like this blog', 'error');
      return;
    }

    this._blogService.toggleLike(currentBlog._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.blog.set(response.blog);
            this._toast.show(response.message, 'success');
          }
        },
        error: (err) => {
          this._toast.show(err.error?.message || 'Failed to toggle like', 'error');
        }
      });
  }

  toggleDislike(): void {
    const currentBlog = this.blog();
    if (!currentBlog) return;

    if (!this._authService.isAuthenticated()) {
      this._toast.show('Please login to dislike this blog', 'error');
      return;
    }

    this._blogService.toggleDislike(currentBlog._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.blog.set(response.blog);
            this._toast.show(response.message, 'success');
          }
        },
        error: (err) => {
          this._toast.show(err.error?.message || 'Failed to toggle dislike', 'error');
        }
      });
  }

  toggleFavorite(): void {
    const currentBlog = this.blog();
    if (!currentBlog) return;

    if (!this._authService.isAuthenticated()) {
      this._toast.show('Please login to favorite this blog', 'error');
      return;
    }

    this._blogService.toggleFavorite(currentBlog._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.blog.set(response.blog);
            this._toast.show(response.message, 'success');
          }
        },
        error: (err) => {
          this._toast.show(err.error?.message || 'Failed to toggle favorite', 'error');
        }
      });
  }
}
