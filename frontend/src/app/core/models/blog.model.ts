import { User } from './user.model';

export interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: User | string; 
  authorDetails?: User;
  likes: string[];
  dislikes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBlogsResponse {
  blogs: Blog[];
  total: number;
  page: number;
  pages: number;
  success: boolean;
}
