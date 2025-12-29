"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepository = void 0;
const Blog_1 = __importDefault(require("../../models/Blog"));
/**
 * Blog Repository Implementation
 * Implements IBlogRepository interface
 * Handles all database operations for Blog entity
 * Following Single Responsibility Principle (SRP)
 */
class BlogRepository {
    /**
     * Create a new blog in the database
     * @param blogData - Blog data
     * @returns Created blog
     */
    async createBlog(blogData) {
        try {
            const blog = new Blog_1.default(blogData);
            await blog.save();
            // Populate author details
            await blog.populate('author', '-password');
            return blog;
        }
        catch (error) {
            throw new Error(`Error creating blog: ${error.message}`);
        }
    }
    /**
     * Find all blogs with pagination and filters
     * @param options - Query options
     * @returns Array of blogs
     */
    async findAllBlogs(options) {
        try {
            const { skip = 0, limit = 10, filters = {}, sort = { createdAt: -1 } } = options;
            const blogs = await Blog_1.default.find(filters)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('author', '-password')
                .exec();
            return blogs;
        }
        catch (error) {
            throw new Error(`Error finding blogs: ${error.message}`);
        }
    }
    /**
     * Find blog by ID
     * @param id - Blog ID
     * @returns Blog or null
     */
    async findBlogById(id) {
        try {
            const blog = await Blog_1.default.findById(id)
                .populate('author', '-password')
                .exec();
            return blog;
        }
        catch (error) {
            throw new Error(`Error finding blog by ID: ${error.message}`);
        }
    }
    /**
     * Find all blogs by author
     * @param authorId - Author ID
     * @returns Array of blogs
     */
    async findBlogsByAuthor(authorId) {
        try {
            const blogs = await Blog_1.default.find({ author: authorId })
                .sort({ createdAt: -1 })
                .populate('author', '-password')
                .exec();
            return blogs;
        }
        catch (error) {
            throw new Error(`Error finding blogs by author: ${error.message}`);
        }
    }
    /**
     * Update blog information
     * @param id - Blog ID
     * @param updateData - Data to update
     * @returns Updated blog
     */
    async updateBlog(id, updateData) {
        try {
            const blog = await Blog_1.default.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true }).populate('author', '-password');
            if (!blog) {
                throw new Error('Blog not found');
            }
            return blog;
        }
        catch (error) {
            throw new Error(`Error updating blog: ${error.message}`);
        }
    }
    /**
     * Delete blog from database
     * @param id - Blog ID
     * @returns Success status
     */
    async deleteBlog(id) {
        try {
            const result = await Blog_1.default.findByIdAndDelete(id);
            return result !== null;
        }
        catch (error) {
            throw new Error(`Error deleting blog: ${error.message}`);
        }
    }
    /**
     * Count total blogs
     * @param filters - Query filters
     * @returns Total count
     */
    async countBlogs(filters = {}) {
        try {
            const count = await Blog_1.default.countDocuments(filters);
            return count;
        }
        catch (error) {
            throw new Error(`Error counting blogs: ${error.message}`);
        }
    }
}
exports.BlogRepository = BlogRepository;
//# sourceMappingURL=BlogRepository.js.map