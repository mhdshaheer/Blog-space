import { IBlogRepository, BlogQueryOptions } from '../interfaces/IBlogRepository';
import { IBlog } from '../../models/Blog';
/**
 * Blog Repository Implementation
 * Implements IBlogRepository interface
 * Handles all database operations for Blog entity
 * Following Single Responsibility Principle (SRP)
 */
export declare class BlogRepository implements IBlogRepository {
    /**
     * Create a new blog in the database
     * @param blogData - Blog data
     * @returns Created blog
     */
    createBlog(blogData: Partial<IBlog>): Promise<IBlog>;
    /**
     * Find all blogs with pagination and filters
     * @param options - Query options
     * @returns Array of blogs
     */
    findAllBlogs(options: BlogQueryOptions): Promise<IBlog[]>;
    /**
     * Find blog by ID
     * @param id - Blog ID
     * @returns Blog or null
     */
    findBlogById(id: string): Promise<IBlog | null>;
    /**
     * Find all blogs by author
     * @param authorId - Author ID
     * @returns Array of blogs
     */
    findBlogsByAuthor(authorId: string): Promise<IBlog[]>;
    /**
     * Update blog information
     * @param id - Blog ID
     * @param updateData - Data to update
     * @returns Updated blog
     */
    updateBlog(id: string, updateData: Partial<IBlog>): Promise<IBlog>;
    /**
     * Delete blog from database
     * @param id - Blog ID
     * @returns Success status
     */
    deleteBlog(id: string): Promise<boolean>;
    /**
     * Count total blogs
     * @param filters - Query filters
     * @returns Total count
     */
    countBlogs(filters?: Record<string, any>): Promise<number>;
}
//# sourceMappingURL=BlogRepository.d.ts.map