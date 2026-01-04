import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../core/models/blog.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  // Inject dependencies
  private readonly _blogService = inject(BlogService);
  private readonly _authService = inject(AuthService);
  private readonly _toast = inject(ToastService);
  private readonly _destroyRef = inject(DestroyRef);

  // Signal-based state
  readonly blogs = signal<Blog[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal('');
  readonly page = signal(1);
  readonly limit = signal(9);
  readonly total = signal(0);

  constructor() {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.isLoading.set(true);
    this._blogService.getBlogs(this.page(), this.limit())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          this.blogs.set(response.blogs);
          this.total.set(response.total);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to load blogs');
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

  isLiked(blog: Blog): boolean {
    const currentUser = this._authService.currentUser();
    if (!blog || !currentUser || !blog.likes) return false;
    return blog.likes.includes(currentUser._id);
  }

  isDisliked(blog: Blog): boolean {
    const currentUser = this._authService.currentUser();
    if (!blog || !currentUser || !blog.dislikes) return false;
    return blog.dislikes.includes(currentUser._id);
  }

  toggleLike(event: Event, blog: Blog): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this._authService.isAuthenticated()) {
      this._toast.show('Please login to like this blog', 'error');
      return;
    }

    this._blogService.toggleLike(blog._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Update the local list
            this.blogs.update(blogs => 
              blogs.map(b => b._id === response.blog._id ? response.blog : b)
            );
            this._toast.show(response.message, 'success');
          }
        },
        error: (err) => {
          this._toast.show(err.error?.message || 'Failed to toggle like', 'error');
        }
      });
  }

  toggleDislike(event: Event, blog: Blog): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this._authService.isAuthenticated()) {
      this._toast.show('Please login to dislike this blog', 'error');
      return;
    }

    this._blogService.toggleDislike(blog._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Update the local list
            this.blogs.update(blogs => 
              blogs.map(b => b._id === response.blog._id ? response.blog : b)
            );
            this._toast.show(response.message, 'success');
          }
        },
        error: (err) => {
          this._toast.show(err.error?.message || 'Failed to toggle dislike', 'error');
        }
      });
  }
}

