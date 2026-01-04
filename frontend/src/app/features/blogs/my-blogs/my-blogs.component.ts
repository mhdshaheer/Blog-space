import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for DatePipe
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BlogService } from '../../../core/services/blog.service';
import { Blog } from '../../../core/models/blog.model';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-blogs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-blogs.component.html'
})
export class MyBlogsComponent {
  // Inject dependencies
  private readonly blogService = inject(BlogService);
  private readonly toastService = inject(ToastService);
  private readonly confirmService = inject(ConfirmService);
  private readonly destroyRef = inject(DestroyRef);

  // Signal-based state
  readonly blogs = signal<Blog[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal('');
  readonly deleteLoading = signal<string | null>(null); // ID of blog being deleted

  constructor() {
    this.loadMyBlogs();
  }

  loadMyBlogs(): void {
    this.isLoading.set(true);
    this.blogService.getMyBlogs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.blogs.set(response.blogs);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to load your blogs');
          this.isLoading.set(false);
        }
      });
  }

  async deleteBlog(id: string): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Delete Article',
      message: 'Are you sure you want to permanently delete this story? This action cannot be undone.',
      confirmText: 'Delete Now',
      type: 'danger'
    });

    if (!confirmed) return;

    this.deleteLoading.set(id);
    this.blogService.deleteBlog(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.blogs.update(blogs => blogs.filter(b => b._id !== id));
            this.toastService.success('Blog deleted successfully');
          }
          this.deleteLoading.set(null);
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Failed to delete blog');
          this.deleteLoading.set(null);
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
}
