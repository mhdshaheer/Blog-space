import { IBlogService, PaginatedBlogsResponse } from '../interfaces/IBlogService';
import { BLOG_MESSAGES } from '../../constants/Messages';
import { IBlogRepository } from '../../repositories/interfaces/IBlogRepository';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IBlog } from '../../models/Blog';
import { BlogSummaryDto, BlogDetailDto, CreateBlogRequestDto, UpdateBlogRequestDto } from '../../dtos/BlogDto';
import { Mapper } from '../../utils/mapper';
import { IStorageService } from '../interfaces/IStorageService';

/**
 * Blog Service Implementation
 * Follows SOLID principles by injecting dependencies
 */
export class BlogService implements IBlogService {
  private _blogRepository: IBlogRepository;
  private _userRepository: IUserRepository;
  private _storageService: IStorageService;

  constructor(
    blogRepository: IBlogRepository, 
    userRepository: IUserRepository,
    storageService: IStorageService
  ) {
    this._blogRepository = blogRepository;
    this._userRepository = userRepository;
    this._storageService = storageService;
  }

  /**
   * Create a new blog
   */
  async createBlog(blogData: CreateBlogRequestDto, authorId: string, imageFile: Express.Multer.File): Promise<BlogDetailDto> {
    if (!blogData.title || blogData.title.length < 5) {
      throw new Error(BLOG_MESSAGES.TITLE_REQUIRED);
    }

    if (!blogData.content || blogData.content.length < 10) {
      throw new Error(BLOG_MESSAGES.CONTENT_REQUIRED);
    }

    if (!imageFile) {
      throw new Error(BLOG_MESSAGES.IMAGE_REQUIRED);
    }

    const author = await this._userRepository.findUserById(authorId);
    if (!author) {
      throw new Error(BLOG_MESSAGES.AUTHOR_NOT_FOUND);
    }

    const blog = await this._blogRepository.createBlog({
      title: blogData.title,
      content: blogData.content,
      author: authorId,
      image: imageFile.path
    });

    const populatedBlog = await this._blogRepository.findBlogById(blog._id.toString());
    return Mapper.toBlogDetailDto(populatedBlog!, authorId);
  }

  /**
   * Get all blogs with pagination (Summarized)
   */
  async getAllBlogs(page: number = 1, limit: number = 10, filters: Record<string, unknown> = {}, currentUserId?: string): Promise<PaginatedBlogsResponse> {
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      this._blogRepository.findAllBlogs({ skip, limit, filters }),
      this._blogRepository.countBlogs(filters)
    ]);

    const pages = Math.ceil(total / limit);

    return {
      blogs: Mapper.toBlogSummaryList(blogs, currentUserId),
      total,
      page,
      pages
    };
  }

  /**
   * Get detailed blog by ID
   */
  async getBlogById(id: string, currentUserId?: string): Promise<BlogDetailDto | null> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error(BLOG_MESSAGES.INVALID_ID);
    }

    const blog = await this._blogRepository.findBlogById(id);
    if (!blog) {
      throw new Error(BLOG_MESSAGES.NOT_FOUND);
    }

    return Mapper.toBlogDetailDto(blog, currentUserId);
  }

  /**
   * Get all blogs by user (Summarized)
   */
  async getBlogsByUser(userId: string): Promise<BlogSummaryDto[]> {
    const blogs = await this._blogRepository.findBlogsByAuthor(userId);
    return Mapper.toBlogSummaryList(blogs, userId);
  }

  /**
   * Update blog
   */
  async updateBlog(id: string, updateData: UpdateBlogRequestDto, userId: string, imageFile?: Express.Multer.File): Promise<BlogDetailDto> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error(BLOG_MESSAGES.INVALID_ID);
    }

    const existingBlog = await this._blogRepository.findBlogById(id);
    if (!existingBlog) {
      throw new Error(BLOG_MESSAGES.NOT_FOUND);
    }

    const authorId = typeof existingBlog.author === 'object' ? existingBlog.author?._id?.toString() : existingBlog.author?.toString();
    if (authorId !== userId) {
      throw new Error(BLOG_MESSAGES.UNAUTHORIZED_UPDATE);
    }

    const update: Partial<IBlog> = {};
    if (updateData.title) {
        if (updateData.title.length < 5) throw new Error(BLOG_MESSAGES.TITLE_REQUIRED);
        update.title = updateData.title;
    }
    if (updateData.content) {
        if (updateData.content.length < 10) throw new Error(BLOG_MESSAGES.CONTENT_REQUIRED);
        update.content = updateData.content;
    }

    if (imageFile) {
      if (existingBlog.image) {
        await this._storageService.deleteImage(existingBlog.image);
      }
      update.image = imageFile.path;
    }

    const updatedBlog = await this._blogRepository.updateBlog(id, update);
    if (!updatedBlog) throw new Error(BLOG_MESSAGES.NOT_FOUND);

    return Mapper.toBlogDetailDto(updatedBlog, userId);
  }

  /**
   * Delete blog
   */
  async deleteBlog(id: string, userId: string): Promise<{ message: string }> {
    const existingBlog = await this._blogRepository.findBlogById(id);
    if (!existingBlog) {
      throw new Error(BLOG_MESSAGES.NOT_FOUND);
    }

    const authorId = typeof existingBlog.author === 'object' ? existingBlog.author?._id?.toString() : existingBlog.author?.toString();
    if (authorId !== userId) {
      throw new Error(BLOG_MESSAGES.UNAUTHORIZED_DELETE);
    }

    if (existingBlog.image) {
      await this._storageService.deleteImage(existingBlog.image);
    }

    await this._blogRepository.deleteBlog(id);
    return { message: BLOG_MESSAGES.DELETE_SUCCESS };
  }

  /**
   * Get favorite blogs (Summarized)
   */
  async getFavoriteBlogs(userId: string): Promise<BlogSummaryDto[]> {
    const blogs = await this._blogRepository.getFavoriteBlogs(userId);
    return Mapper.toBlogSummaryList(blogs, userId);
  }

  /**
   * Toggle like
   */
  async toggleLike(blogId: string, userId: string): Promise<BlogDetailDto> {
    const blog = await this._blogRepository.toggleLike(blogId, userId);
    if (!blog) throw new Error(BLOG_MESSAGES.NOT_FOUND);
    return Mapper.toBlogDetailDto(blog, userId);
  }

  /**
   * Toggle dislike
   */
  async toggleDislike(blogId: string, userId: string): Promise<BlogDetailDto> {
    const blog = await this._blogRepository.toggleDislike(blogId, userId);
    if (!blog) throw new Error(BLOG_MESSAGES.NOT_FOUND);
    return Mapper.toBlogDetailDto(blog, userId);
  }

  /**
   * Toggle favorite
   */
  async toggleFavorite(blogId: string, userId: string): Promise<BlogDetailDto> {
    const blog = await this._blogRepository.toggleFavorite(blogId, userId);
    if (!blog) throw new Error(BLOG_MESSAGES.NOT_FOUND);
    return Mapper.toBlogDetailDto(blog, userId);
  }
}
