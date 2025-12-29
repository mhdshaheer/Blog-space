import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../../../core/services/blog.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './blog-form.component.html'
})
export class BlogFormComponent implements OnInit {
  blogForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  blogId: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  error = '';

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.blogId = id;
        this.loadBlog(id);
      }
    });
  }

  loadBlog(id: string): void {
    this.isLoading = true;
    this.blogService.getBlogById(id).subscribe({
      next: (response) => {
        if (response.success) {
          const { title, content, image } = response.blog;
          this.blogForm.patchValue({ title, content });
          this.imagePreview = this.getImageUrl(image);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load blog details';
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      
      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.blogForm.invalid) return;
    
    if (!this.isEditMode && !this.selectedFile) {
      this.error = 'Please select an image';
      return;
    }

    this.isLoading = true;
    this.error = '';

    const formData = new FormData();
    formData.append('title', this.blogForm.get('title')?.value);
    formData.append('content', this.blogForm.get('content')?.value);
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const request = this.isEditMode && this.blogId
      ? this.blogService.updateBlog(this.blogId, formData)
      : this.blogService.createBlog(formData);

    request.subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success(this.isEditMode ? 'Article updated!' : 'Article published!');
          this.router.navigate(['/my-blogs']);
        } else {
          this.error = response.message || 'Operation failed';
          this.toastService.error(this.error);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Something went wrong';
        this.toastService.error(this.error);
        this.isLoading = false;
      }
    });
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    return `${environment.baseUrl}${imagePath}`;
  }

  handleImageError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80';
  }
}
