import { IBlogService, PaginatedBlogsResponse } from '../interfaces/IBlogService';
import { BLOG_MESSAGES } from '../../constants/Messages';
import { IBlogRepository } from '../../repositories/interfaces/IBlogRepository';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IBlog } from '../../models/Blog';
import cloudinary from '../../config/cloudinary';
// Removed path and fs/promises for Cloudinary migration

/**
 * Blog Service Implementation
 * Implements IBlogService interface
 * Handles blog business logic
 * Following Single Responsibility and Dependency Inversion Principles
 */
export class BlogService implements IBlogService {
  private _blogRepository: IBlogRepository;
  private _userRepository: IUserRepository;

  constructor(blogRepository: IBlogRepository, userRepository: IUserRepository) {
    this._blogRepository = blogRepository;
    this._userRepository = userRepository;
  }

  /**
   * Create a new blog
   * @param blogData - Blog data
   * @param authorId - Author user ID
   * @param imageFile - Uploaded image file
   * @returns Created blog
   */
  async createBlog(blogData: Partial<IBlog>, authorId: string, imageFile: Express.Multer.File): Promise<IBlog> {
    // Validate blog data
    if (!blogData.title || blogData.title.length < 5) {
      throw new Error(BLOG_MESSAGES.TITLE_REQUIRED);
    }

    if (!blogData.content || blogData.content.length < 10) {
      throw new Error(BLOG_MESSAGES.CONTENT_REQUIRED);
    }

    if (!imageFile) {
      throw new Error(BLOG_MESSAGES.IMAGE_REQUIRED);
    }

    // Verify author exists
    const author = await this._userRepository.findUserById(authorId);
    if (!author) {
      throw new Error(BLOG_MESSAGES.AUTHOR_NOT_FOUND);
    }

    // Process image upload (Cloudinary URL provided by multer-storage-cloudinary)
    const imagePath = imageFile.path;

    // Create blog with author and image
    const blog = await this._blogRepository.createBlog({
      ...blogData,
      author: authorId,
      image: imagePath
    });

    return blog;
  }

  /**
   * Get all blogs with pagination
   * @param page - Page number
   * @param limit - Items per page
   * @param filters - Optional filters
   * @returns Paginated blogs response
   */
  async getAllBlogs(page: number = 1, limit: number = 10, filters: Record<string, any> = {}): Promise<PaginatedBlogsResponse> {
    // Calculate skip
    const skip = (page - 1) * limit;

    // Get blogs and total count
    const [blogs, total] = await Promise.all([
      this._blogRepository.findAllBlogs({ skip, limit, filters }),
      this._blogRepository.countBlogs(filters)
    ]);

    // Calculate total pages
    const pages = Math.ceil(total / limit);

    return {
      blogs,
      total,
      page,
      pages
    };
  }

  /**
   * Get blog by ID
   * @param id - Blog ID
   * @returns Blog or null
   */
  async getBlogById(id: string): Promise<IBlog | null> {
    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error(BLOG_MESSAGES.INVALID_ID);
    }

    const blog = await this._blogRepository.findBlogById(id);
    
    if (!blog) {
      throw new Error(BLOG_MESSAGES.NOT_FOUND);
    }

    return blog;
  }

  /**
   * Get all blogs by user
   * @param userId - User ID
   * @returns Array of blogs
   */
  async getBlogsByUser(userId: string): Promise<IBlog[]> {
    const blogs = await this._blogRepository.findBlogsByAuthor(userId);
    return blogs;
  }

  /**
   * Update blog
   * @param id - Blog ID
   * @param updateData - Data to update
   * @param userId - User ID (for ownership verification)
   * @param imageFile - Optional new image file
   * @returns Updated blog
   */
  async updateBlog(id: string, updateData: Partial<IBlog>, userId: string, imageFile?: Express.Multer.File): Promise<IBlog> {
    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error(BLOG_MESSAGES.INVALID_ID);
    }

    // Fetch existing blog
    const existingBlog = await this._blogRepository.findBlogById(id);
    
    if (!existingBlog) {
      throw new Error(BLOG_MESSAGES.NOT_FOUND);
    }

    // Verify ownership - accurately extract ID whether populated or not
    const existingAuthorId = (existingBlog.author as any)._id 
      ? (existingBlog.author as any)._id.toString() 
      : existingBlog.author.toString();
    const currentUserId = userId.toString();

    if (existingAuthorId !== currentUserId) {
      throw new Error(BLOG_MESSAGES.UNAUTHORIZED_UPDATE);
    }

    // Validate update data
    if (updateData.title && updateData.title.length < 5) {
      throw new Error(BLOG_MESSAGES.TITLE_REQUIRED);
    }

    if (updateData.content && updateData.content.length < 10) {
      throw new Error(BLOG_MESSAGES.CONTENT_REQUIRED);
    }

    // Process new image if provided
    if (imageFile) {
      // Delete old image from Cloudinary if it exists
      if (existingBlog.image && existingBlog.image.includes('cloudinary')) {
        await this._deleteCloudinaryImage(existingBlog.image);
      }
      
      // Set new image path (Cloudinary URL)
      updateData.image = imageFile.path;
    }

    // Update blog
    const updatedBlog = await this._blogRepository.updateBlog(id, updateData);
    
    return updatedBlog;
  }

  /**
   * Delete blog
   * @param id - Blog ID
   * @param userId - User ID (for ownership verification)
   * @returns Success message
   */
  async deleteBlog(id: string, userId: string): Promise<{ message: string }> {
    // Fetch existing blog
    const existingBlog = await this._blogRepository.findBlogById(id);
    
    if (!existingBlog) {
      throw new Error(BLOG_MESSAGES.NOT_FOUND);
    }

    // Verify ownership
    const authorId = (existingBlog.author as any)?._id?.toString?.() ?? existingBlog.author.toString();
    if (authorId !== userId) {
      throw new Error(BLOG_MESSAGES.UNAUTHORIZED_DELETE);
    }

    // Delete associated image from Cloudinary
    if (existingBlog.image && existingBlog.image.includes('cloudinary')) {
      await this._deleteCloudinaryImage(existingBlog.image);
    }

    // Delete blog from database
    await this._blogRepository.deleteBlog(id);

    return { message: BLOG_MESSAGES.DELETE_SUCCESS };
  }

  /**
   * Helper to delete image from Cloudinary
   * @param imageUrl - Full Cloudinary URL
   */
  private async _deleteCloudinaryImage(imageUrl: string): Promise<void> {
    try {
      // Extract public_id from URL
      // Example: https://res.cloudinary.com/demo/image/upload/v1234/folder/public_id.jpg
      const parts = imageUrl.split('/');
      const lastPart = parts.pop() || '';
      const publicIdWithExtension = lastPart.split('.')[0];
      
      // We need to include the folder path if it's there
      // For this project, it's 'blog-space/blogs/'
      const folderIndex = parts.indexOf('blog-space');
      if (folderIndex !== -1) {
        const folderPath = parts.slice(folderIndex).join('/');
        const fullPublicId = `${folderPath}/${publicIdWithExtension}`;
        await cloudinary.uploader.destroy(fullPublicId);
      } else {
        // Fallback for root folder images
        await cloudinary.uploader.destroy(publicIdWithExtension);
      }
    } catch (error) {
       console.error('[CLOUDINARY] Deletion error:', error);
       // We don't throw here to ensure the record is still updated/deleted even if image deletion fails
    }
  }

  /**
   * Get blogs favorited by a user
   * @param userId - User ID
   * @returns Array of blogs
   */
  async getFavoriteBlogs(userId: string): Promise<IBlog[]> {
    return await this._blogRepository.getFavoriteBlogs(userId);
  }

  /**
   * Toggle like on a blog
   * @param blogId - Blog ID
   * @param userId - User ID
   * @returns Updated blog
   */
  async toggleLike(blogId: string, userId: string): Promise<IBlog> {
    // Validate ID format
    if (!blogId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error(BLOG_MESSAGES.INVALID_ID);
    }

    const blog = await this._blogRepository.toggleLike(blogId, userId);
    
    if (!blog) {
      throw new Error(BLOG_MESSAGES.NOT_FOUND);
    }

    return blog;
  }
}
