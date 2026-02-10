import { IUser } from '../models/User';
import { IBlog } from '../models/Blog';
import { UserDto } from '../dtos/UserDto';
import { BlogDto } from '../dtos/BlogDto';
import mongoose from 'mongoose';

export class Mapper {
  static toUserDto(user: IUser): UserDto {
    return {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toBlogDto(blog: IBlog, currentUserId?: string): BlogDto {
    const author = blog.author;
    let authorData: string | UserDto;

    if (author instanceof mongoose.Types.ObjectId || typeof author === 'string') {
      authorData = author.toString();
    } else {
      // If populated
      authorData = this.toUserDto(author as any);
    }

    const likes = blog.likes?.map(id => id.toString()) || [];
    const dislikes = blog.dislikes?.map(id => id.toString()) || [];
    const favorites = blog.favorites?.map(id => id.toString()) || [];

    return {
      _id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      image: blog.image,
      author: authorData,
      likes,
      dislikes,
      favorites,
      likesCount: likes.length,
      dislikesCount: dislikes.length,
      favoritesCount: favorites.length,
      isLiked: currentUserId ? likes.includes(currentUserId) : false,
      isDisliked: currentUserId ? dislikes.includes(currentUserId) : false,
      isFavorited: currentUserId ? favorites.includes(currentUserId) : false,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };
  }

  static toBlogDtoList(blogs: IBlog[], currentUserId?: string): BlogDto[] {
    return blogs.map(blog => this.toBlogDto(blog, currentUserId));
  }
}
