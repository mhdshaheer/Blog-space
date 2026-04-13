import { UserDto } from './UserDto';

/**
 * Summary DTO for blog listings (Home/Search pages)
 * Optimized to exclude large content fields
 */
export interface BlogSummaryDto {
  _id: string;
  title: string;
  image: string;
  author: string | UserDto;
  likesCount: number;
  createdAt: Date;
  isLiked: boolean;
}

/**
 * Detailed DTO for a single blog page
 */
export interface BlogDetailDto {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: UserDto;
  likes: string[];
  dislikes: string[];
  favorites: string[];
  likesCount: number;
  dislikesCount: number;
  favoritesCount: number;
  isLiked: boolean;
  isDisliked: boolean;
  isFavorited: boolean;
  isAuthor: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Request DTO for creating a blog
 */
export interface CreateBlogRequestDto {
  title: string;
  content: string;
}

/**
 * Request DTO for updating a blog
 */
export interface UpdateBlogRequestDto {
  title?: string;
  content?: string;
}
