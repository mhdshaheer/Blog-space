import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for DatePipe and NgClass
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BlogService } from '../../../core/services/blog.service';
import { Blog } from '../../../core/models/blog.model';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast.service';

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
}
