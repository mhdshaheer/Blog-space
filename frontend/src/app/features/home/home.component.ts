import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../core/models/blog.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  blogs: Blog[] = [];
  isLoading = true;
  error = '';
  page = 1;
  limit = 9;
  total = 0;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.isLoading = true;
    this.blogService.getBlogs(this.page, this.limit).subscribe({
      next: (response) => {
        this.blogs = response.blogs;
        this.total = response.total;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load blogs';
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

