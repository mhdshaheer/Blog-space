import { BlogSummaryDto, BlogDetailDto, CreateBlogRequestDto, UpdateBlogRequestDto } from '../../dtos/BlogDto';

export interface PaginatedBlogsResponse {
  blogs: BlogSummaryDto[];
  total: number;
  page: number;
  pages: number;
}

/**
 * Blog Service Interface
 * Defines blog business logic contract
 */
export interface IBlogService {
  /**
   * Create a new blog
   * @param blogData - Blog creation data (Request DTO)
   * @param authorId - Author user ID
   * @param imageFile - Uploaded image file
   * @returns Detailed blog DTO for navigation
   */
  createBlog(blogData: CreateBlogRequestDto, authorId: string, imageFile: Express.Multer.File): Promise<BlogDetailDto>;

  /**
   * Get all blogs with pagination (Summarized for Home/Search)
   * @param page - Page number
   * @param limit - Items per page
   * @param filters - Optional filters
   * @param currentUserId - Optional requesting user ID
   * @returns Paginated blogs with summary objects
   */
  getAllBlogs(page: number, limit: number, filters?: Record<string, unknown>, currentUserId?: string): Promise<PaginatedBlogsResponse>;

  /**
   * Get detailed blog by ID (For View Page)
   * @param id - Blog ID
   * @param currentUserId - Optional requesting user ID
   * @returns BlogDetailDto or null
   */
  getBlogById(id: string, currentUserId?: string): Promise<BlogDetailDto | null>;

  /**
   * Get all blogs by user (Summarized for Profile)
   * @param userId - User ID
   * @returns Array of blog summaries
   */
  getBlogsByUser(userId: string): Promise<BlogSummaryDto[]>;

  /**
   * Update blog
   * @param id - Blog ID
   * @param updateData - Update request DTO
   * @param userId - User ID (for ownership verification)
   * @param imageFile - Optional new image file
   * @returns Updated blog detail object
   */
  updateBlog(id: string, updateData: UpdateBlogRequestDto, userId: string, imageFile?: Express.Multer.File): Promise<BlogDetailDto>;

  /**
   * Delete blog
   */
  deleteBlog(id: string, userId: string): Promise<{ message: string }>;

  /**
   * Get blogs favorited by a user (Summarized)
   */
  getFavoriteBlogs(userId: string): Promise<BlogSummaryDto[]>;

  /**
   * Toggle like on a blog
   */
  toggleLike(blogId: string, userId: string): Promise<BlogDetailDto>;

  /**
   * Toggle dislike on a blog
   */
  toggleDislike(blogId: string, userId: string): Promise<BlogDetailDto>;

  /**
   * Toggle favorite on a blog
   */
  toggleFavorite(blogId: string, userId: string): Promise<BlogDetailDto>;
}
