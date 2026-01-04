import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../core/models/blog.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  // Inject dependencies
  private readonly _blogService = inject(BlogService);
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
}

