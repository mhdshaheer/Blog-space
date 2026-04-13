import { IUser } from '../models/User';
import { IBlog } from '../models/Blog';
import { UserDto } from '../dtos/UserDto';
import { BlogSummaryDto, BlogDetailDto } from '../dtos/BlogDto';
import mongoose from 'mongoose';

/**
 * Mapper Utility Class
 * Handles transformation between Models and DTOs
 */
export class Mapper {
  /**
   * Transforms a User model to a UserDto
   * @param user - User model (IUser)
   * @returns UserDto
   */
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

  /**
   * Transforms a Blog model to a BlogSummaryDto (for listings)
   */
  static toBlogSummaryDto(blog: IBlog, currentUserId?: string): BlogSummaryDto {
    const author = blog.author;
    let authorData: string | UserDto;

    if (author && typeof author !== 'string' && !(author instanceof mongoose.Types.ObjectId)) {
      authorData = this.toUserDto(author as IUser);
    } else {
      authorData = author ? author.toString() : '';
    }

    const likes = (blog.likes || []).map(id => id.toString());

    return {
      _id: blog._id.toString(),
      title: blog.title,
      image: blog.image,
      author: authorData,
      likesCount: likes.length,
      isLiked: currentUserId ? likes.includes(currentUserId) : false,
      createdAt: blog.createdAt
    };
  }

  /**
   * Transforms a Blog model to a BlogDetailDto (for single page)
   */
  static toBlogDetailDto(blog: IBlog, currentUserId?: string): BlogDetailDto {
    const author = blog.author;
    if (!author || typeof author === 'string' || author instanceof mongoose.Types.ObjectId) {
      throw new Error('Author must be populated for BlogDetailDto');
    }

    const authorDto = this.toUserDto(author as IUser);
    const likes = (blog.likes || []).map(id => id.toString());
    const dislikes = (blog.dislikes || []).map(id => id.toString());
    const favorites = (blog.favorites || []).map(id => id.toString());

    return {
      _id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      image: blog.image,
      author: authorDto,
      likes,
      dislikes,
      favorites,
      likesCount: likes.length,
      dislikesCount: dislikes.length,
      favoritesCount: favorites.length,
      isLiked: currentUserId ? likes.includes(currentUserId) : false,
      isDisliked: currentUserId ? dislikes.includes(currentUserId) : false,
      isFavorited: currentUserId ? favorites.includes(currentUserId) : false,
      isAuthor: currentUserId === authorDto._id,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };
  }

  /**
   * Transforms a list of Blog models to a list of BlogSummaryDtos
   */
  static toBlogSummaryList(blogs: IBlog[], currentUserId?: string): BlogSummaryDto[] {
    return blogs.map(blog => this.toBlogSummaryDto(blog, currentUserId));
  }
}
