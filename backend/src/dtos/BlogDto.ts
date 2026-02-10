import { UserDto } from './UserDto';

export interface BlogDto {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: string | UserDto;
  likes: string[];
  dislikes: string[];
  favorites: string[];
  likesCount: number;
  dislikesCount: number;
  favoritesCount: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  isFavorited?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
