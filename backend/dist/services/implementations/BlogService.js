"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
/**
 * Blog Service Implementation
 * Implements IBlogService interface
 * Handles blog business logic
 * Following Single Responsibility and Dependency Inversion Principles
 */
class BlogService {
    constructor(blogRepository, userRepository) {
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
    }
    /**
     * Create a new blog
     * @param blogData - Blog data
     * @param authorId - Author user ID
     * @param imageFile - Uploaded image file
     * @returns Created blog
     */
    async createBlog(blogData, authorId, imageFile) {
        // Validate blog data
        if (!blogData.title || blogData.title.length < 5) {
            throw new Error('Title must be at least 5 characters');
        }
        if (!blogData.content || blogData.content.length < 10) {
            throw new Error('Content must be at least 10 characters');
        }
        if (!imageFile) {
            throw new Error('Image is required');
        }
        // Verify author exists
        const author = await this.userRepository.findUserById(authorId);
        if (!author) {
            throw new Error('Author not found');
        }
        // Process image upload (file path relative to uploads folder)
        const imagePath = `/uploads/${imageFile.filename}`;
        // Create blog with author and image
        const blog = await this.blogRepository.createBlog({
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
    async getAllBlogs(page = 1, limit = 10, filters = {}) {
        // Calculate skip
        const skip = (page - 1) * limit;
        // Get blogs and total count
        const [blogs, total] = await Promise.all([
            this.blogRepository.findAllBlogs({ skip, limit, filters }),
            this.blogRepository.countBlogs(filters)
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
    async getBlogById(id) {
        // Validate ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error('Invalid blog ID format');
        }
        const blog = await this.blogRepository.findBlogById(id);
        if (!blog) {
            throw new Error('Blog not found');
        }
        return blog;
    }
    /**
     * Get all blogs by user
     * @param userId - User ID
     * @returns Array of blogs
     */
    async getBlogsByUser(userId) {
        const blogs = await this.blogRepository.findBlogsByAuthor(userId);
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
    async updateBlog(id, updateData, userId, imageFile) {
        // Fetch existing blog
        const existingBlog = await this.blogRepository.findBlogById(id);
        if (!existingBlog) {
            throw new Error('Blog not found');
        }
        // Verify ownership
        if (existingBlog.author.toString() !== userId) {
            throw new Error('Unauthorized: You can only update your own blogs');
        }
        // Validate update data
        if (updateData.title && updateData.title.length < 5) {
            throw new Error('Title must be at least 5 characters');
        }
        if (updateData.content && updateData.content.length < 10) {
            throw new Error('Content must be at least 10 characters');
        }
        // Process new image if provided
        if (imageFile) {
            // Delete old image
            try {
                const oldImagePath = path_1.default.join(process.cwd(), existingBlog.image);
                await promises_1.default.unlink(oldImagePath);
            }
            catch (error) {
                console.warn('Could not delete old image:', error);
            }
            // Set new image path
            updateData.image = `/uploads/${imageFile.filename}`;
        }
        // Update blog
        const updatedBlog = await this.blogRepository.updateBlog(id, updateData);
        return updatedBlog;
    }
    /**
     * Delete blog
     * @param id - Blog ID
     * @param userId - User ID (for ownership verification)
     * @returns Success message
     */
    async deleteBlog(id, userId) {
        // Fetch existing blog
        const existingBlog = await this.blogRepository.findBlogById(id);
        if (!existingBlog) {
            throw new Error('Blog not found');
        }
        // Verify ownership
        if (existingBlog.author.toString() !== userId) {
            throw new Error('Unauthorized: You can only delete your own blogs');
        }
        // Delete associated image file
        try {
            const imagePath = path_1.default.join(process.cwd(), existingBlog.image);
            await promises_1.default.unlink(imagePath);
        }
        catch (error) {
            console.warn('Could not delete image file:', error);
        }
        // Delete blog from database
        await this.blogRepository.deleteBlog(id);
        return { message: 'Blog deleted successfully' };
    }
}
exports.BlogService = BlogService;
//# sourceMappingURL=BlogService.js.map