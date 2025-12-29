import { IBlog } from '../../models/Blog';
export interface BlogQueryOptions {
    skip?: number;
    limit?: number;
    filters?: Record<string, any>;
    sort?: Record<string, 1 | -1>;
}
/**
 * Blog Repository Interface
 * Defines the contract for blog data access operations
 * Following Interface Segregation Principle (ISP)
 */
export interface IBlogRepository {
    /**
     * Create a new blog
     * @param blogData - Blog data object
     * @returns Created blog
     */
    createBlog(blogData: Partial<IBlog>): Promise<IBlog>;
    /**
     * Find all blogs with pagination and filters
     * @param options - Query options (skip, limit, filters)
     * @returns Array of blogs
     */
    findAllBlogs(options: BlogQueryOptions): Promise<IBlog[]>;
    /**
     * Find blog by ID
     * @param id - Blog ID
     * @returns Blog object or null
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
     * Delete blog
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
//# sourceMappingURL=IBlogRepository.d.ts.map