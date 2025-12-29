import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Blog, PaginatedBlogsResponse } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = `${environment.apiUrl}/blogs`;

  constructor(private http: HttpClient) {}

  getBlogs(page: number = 1, limit: number = 10): Observable<PaginatedBlogsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<PaginatedBlogsResponse>(this.apiUrl, { params });
  }

  getBlogById(id: string): Observable<{ success: boolean; blog: Blog }> {
    return this.http.get<{ success: boolean; blog: Blog }>(`${this.apiUrl}/${id}`);
  }

  getMyBlogs(): Observable<{ success: boolean; count: number; blogs: Blog[] }> {
    return this.http.get<{ success: boolean; count: number; blogs: Blog[] }>(`${this.apiUrl}/user/me`);
  }

  createBlog(formData: FormData): Observable<{ success: boolean; message: string; blog: Blog }> {
    return this.http.post<{ success: boolean; message: string; blog: Blog }>(this.apiUrl, formData);
  }

  updateBlog(id: string, formData: FormData): Observable<{ success: boolean; message: string; blog: Blog }> {
    return this.http.put<{ success: boolean; message: string; blog: Blog }>(`${this.apiUrl}/${id}`, formData);
  }

  deleteBlog(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
