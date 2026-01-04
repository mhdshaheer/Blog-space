"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const Messages_1 = require("../../constants/Messages");
// Removed path and fs/promises for Cloudinary migration
/**
 * Blog Service Implementation
 * Implements IBlogService interface
 * Handles blog business logic
 * Following Single Responsibility and Dependency Inversion Principles
 */
class BlogService {
    constructor(blogRepository, userRepository) {
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
    async createBlog(blogData, authorId, imageFile) {
        // Validate blog data
        if (!blogData.title || blogData.title.length < 5) {
            throw new Error(Messages_1.BLOG_MESSAGES.TITLE_REQUIRED);
        }
        if (!blogData.content || blogData.content.length < 10) {
            throw new Error(Messages_1.BLOG_MESSAGES.CONTENT_REQUIRED);
        }
        if (!imageFile) {
            throw new Error(Messages_1.BLOG_MESSAGES.IMAGE_REQUIRED);
        }
        // Verify author exists
        const author = await this._userRepository.findUserById(authorId);
        if (!author) {
            throw new Error(Messages_1.BLOG_MESSAGES.AUTHOR_NOT_FOUND);
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
    async getAllBlogs(page = 1, limit = 10, filters = {}) {
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
    async getBlogById(id) {
        // Validate ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error(Messages_1.BLOG_MESSAGES.INVALID_ID);
        }
        const blog = await this._blogRepository.findBlogById(id);
        if (!blog) {
            throw new Error(Messages_1.BLOG_MESSAGES.NOT_FOUND);
        }
        return blog;
    }
    /**
     * Get all blogs by user
     * @param userId - User ID
     * @returns Array of blogs
     */
    async getBlogsByUser(userId) {
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
    async updateBlog(id, updateData, userId, imageFile) {
        // Fetch existing blog
        const existingBlog = await this._blogRepository.findBlogById(id);
        if (!existingBlog) {
            throw new Error(Messages_1.BLOG_MESSAGES.NOT_FOUND);
        }
        // Verify ownership
        const authorId = existingBlog.author?._id?.toString?.() ?? existingBlog.author.toString();
        if (authorId !== userId) {
            throw new Error(Messages_1.BLOG_MESSAGES.UNAUTHORIZED_UPDATE);
        }
        // Validate update data
        if (updateData.title && updateData.title.length < 5) {
            throw new Error(Messages_1.BLOG_MESSAGES.TITLE_REQUIRED);
        }
        if (updateData.content && updateData.content.length < 10) {
            throw new Error(Messages_1.BLOG_MESSAGES.CONTENT_REQUIRED);
        }
        // Process new image if provided
        if (imageFile) {
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
    async deleteBlog(id, userId) {
        // Fetch existing blog
        const existingBlog = await this._blogRepository.findBlogById(id);
        if (!existingBlog) {
            throw new Error(Messages_1.BLOG_MESSAGES.NOT_FOUND);
        }
        // Verify ownership
        const authorId = existingBlog.author?._id?.toString?.() ?? existingBlog.author.toString();
        if (authorId !== userId) {
            throw new Error(Messages_1.BLOG_MESSAGES.UNAUTHORIZED_DELETE);
        }
        // Note: Cloudinary image deletion can be implemented using cloudinary.v2.uploader.destroy
        // For now, we focus on the transition to Cloudinary for storage.
        // Delete blog from database
        await this._blogRepository.deleteBlog(id);
        return { message: Messages_1.BLOG_MESSAGES.DELETE_SUCCESS };
    }
}
exports.BlogService = BlogService;
//# sourceMappingURL=BlogService.js.map