import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
export class MyBlogsComponent implements OnInit {
  blogs: Blog[] = [];
  isLoading = true;
  error = '';
  deleteLoading: string | null = null; // ID of blog being deleted

  constructor(
    private blogService: BlogService,
    private toastService: ToastService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.loadMyBlogs();
  }

  loadMyBlogs(): void {
    this.isLoading = true;
    this.blogService.getMyBlogs().subscribe({
      next: (response) => {
        if (response.success) {
          this.blogs = response.blogs;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load your blogs';
        this.isLoading = false;
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

    this.deleteLoading = id;
    this.blogService.deleteBlog(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.blogs = this.blogs.filter(b => b._id !== id);
          this.toastService.success('Blog deleted successfully');
        }
        this.deleteLoading = null;
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to delete blog');
        this.deleteLoading = null;
      }
    });
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80';
    if (imagePath.startsWith('http')) return imagePath;
    return `${environment.baseUrl}${imagePath}`;
  }

  handleImageError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80';
  }
}
