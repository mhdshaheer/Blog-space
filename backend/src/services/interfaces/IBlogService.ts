import { IBlog } from '../../models/Blog';

export interface PaginatedBlogsResponse {
  blogs: IBlog[];
  total: number;
  page: number;
  pages: number;
}

/**
 * Blog Service Interface
 * Defines blog business logic contract
 * Following Interface Segregation Principle (ISP)
 */
export interface IBlogService {
  /**
   * Create a new blog
   * @param blogData - Blog data
   * @param authorId - Author user ID
   * @param imageFile - Uploaded image file
   * @returns Created blog
   */
  createBlog(blogData: Partial<IBlog>, authorId: string, imageFile: Express.Multer.File): Promise<IBlog>;

  /**
   * Get all blogs with pagination
   * @param page - Page number
   * @param limit - Items per page
   * @param filters - Optional filters
   * @returns Paginated blogs response
   */
  getAllBlogs(page: number, limit: number, filters?: Record<string, any>): Promise<PaginatedBlogsResponse>;

  /**
   * Get blog by ID
   * @param id - Blog ID
   * @returns Blog or null
   */
  getBlogById(id: string): Promise<IBlog | null>;

  /**
   * Get all blogs by user
   * @param userId - User ID
   * @returns Array of blogs
   */
  getBlogsByUser(userId: string): Promise<IBlog[]>;

  /**
   * Update blog
   * @param id - Blog ID
   * @param updateData - Data to update
   * @param userId - User ID (for ownership verification)
   * @param imageFile - Optional new image file
   * @returns Updated blog
   */
  updateBlog(id: string, updateData: Partial<IBlog>, userId: string, imageFile?: Express.Multer.File): Promise<IBlog>;

  /**
   * Delete blog
   * @param id - Blog ID
   * @param userId - User ID (for ownership verification)
   * @returns Success message
   */
  deleteBlog(id: string, userId: string): Promise<{ message: string }>;

  /**
   * Toggle like on a blog
   * @param blogId - Blog ID
   * @param userId - User ID
   * @returns Updated blog
   */
  toggleLike(blogId: string, userId: string): Promise<IBlog>;
}
