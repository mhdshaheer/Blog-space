import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadBlog(id);
      }
    });
  }

  loadBlog(id: string): void {
    this.isLoading = true;
    this.blogService.getBlogById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.blog = response.blog;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load blog post';
        this.isLoading = false;
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

  getAuthorName(blog: Blog): string {
    if (!blog.author || typeof blog.author === 'string') {
      return 'Guest Author';
    }
    return blog.author.username;
  }
}
