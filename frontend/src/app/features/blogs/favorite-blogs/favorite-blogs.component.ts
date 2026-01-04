import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BlogService } from '../../../core/services/blog.service';
import { Blog } from '../../../core/models/blog.model';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-favorite-blogs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorite-blogs.component.html'
})
export class FavoriteBlogsComponent {
  private readonly _blogService = inject(BlogService);
  private readonly _authService = inject(AuthService);
  private readonly _toastService = inject(ToastService);
  private readonly _destroyRef = inject(DestroyRef);

  readonly blogs = signal<Blog[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal('');

  constructor() {
    this.loadFavoriteBlogs();
  }

  loadFavoriteBlogs(): void {
    this.isLoading.set(true);
    this._blogService.getFavoriteBlogs()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.blogs.set(response.blogs);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to load favorite blogs');
          this.isLoading.set(false);
        }
      });
  }

  isLiked(blog: Blog): boolean {
    const currentUser = this._authService.currentUser();
    if (!blog || !currentUser || !blog.likes) return false;
    return blog.likes.includes(currentUser._id);
  }

  toggleLike(event: Event, blog: Blog): void {
    event.preventDefault();
    event.stopPropagation();

    this._blogService.toggleLike(blog._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Remove from list if unliked
            this.blogs.update(blogs => blogs.filter(b => b._id !== blog._id));
            this._toastService.show(response.message, 'success');
          }
        },
        error: (err) => {
          this._toastService.show(err.error?.message || 'Failed to toggle favorite', 'error');
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
}
