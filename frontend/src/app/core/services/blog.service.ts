import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Blog, PaginatedBlogsResponse } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly _apiUrl = `${environment.apiUrl}/blogs`;

  constructor(private readonly _http: HttpClient) {}

  getBlogs(page: number = 1, limit: number = 10): Observable<PaginatedBlogsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this._http.get<PaginatedBlogsResponse>(this._apiUrl, { params });
  }

  getBlogById(id: string): Observable<{ success: boolean; blog: Blog }> {
    return this._http.get<{ success: boolean; blog: Blog }>(`${this._apiUrl}/${id}`);
  }

  getMyBlogs(): Observable<{ success: boolean; count: number; blogs: Blog[] }> {
    return this._http.get<{ success: boolean; count: number; blogs: Blog[] }>(`${this._apiUrl}/user/me`);
  }

  getFavoriteBlogs(): Observable<{ success: boolean; count: number; blogs: Blog[] }> {
    return this._http.get<{ success: boolean; count: number; blogs: Blog[] }>(`${this._apiUrl}/user/favorites`);
  }

  createBlog(formData: FormData): Observable<{ success: boolean; message: string; blog: Blog }> {
    return this._http.post<{ success: boolean; message: string; blog: Blog }>(this._apiUrl, formData);
  }

  updateBlog(id: string, formData: FormData): Observable<{ success: boolean; message: string; blog: Blog }> {
    return this._http.put<{ success: boolean; message: string; blog: Blog }>(`${this._apiUrl}/${id}`, formData);
  }

  deleteBlog(id: string): Observable<{ success: boolean; message: string }> {
    return this._http.delete<{ success: boolean; message: string }>(`${this._apiUrl}/${id}`);
  }

  toggleLike(id: string): Observable<{ success: boolean; message: string; blog: Blog }> {
    return this._http.post<{ success: boolean; message: string; blog: Blog }>(`${this._apiUrl}/${id}/like`, {});
  }

  toggleDislike(id: string): Observable<{ success: boolean; message: string; blog: Blog }> {
    return this._http.post<{ success: boolean; message: string; blog: Blog }>(`${this._apiUrl}/${id}/dislike`, {});
  }

  toggleFavorite(id: string): Observable<{ success: boolean; message: string; blog: Blog }> {
    return this._http.post<{ success: boolean; message: string; blog: Blog }>(`${this._apiUrl}/${id}/favorite`, {});
  }
}
