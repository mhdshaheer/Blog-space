"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const express_validator_1 = require("express-validator");
const HttpStatus_1 = require("../../enums/HttpStatus");
const Messages_1 = require("../../constants/Messages");
/**
 * Blog Controller Implementation
 * Implements IBlogController interface
 * Handles HTTP requests for blog management
 * Following Single Responsibility and Dependency Inversion Principles
 */
class BlogController {
    constructor(blogService) {
        /**
         * Create a new blog
         * POST /api/blogs
         * Protected route - requires authentication
         */
        this.createBlog = async (req, res, next) => {
            try {
                // Validate request
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
                    return;
                }
                if (!req.file) {
                    res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ message: Messages_1.BLOG_MESSAGES.IMAGE_REQUIRED });
                    return;
                }
                const { title, content } = req.body;
                const authorId = req.user.userId;
                // Call service
                const blog = await this._blogService.createBlog({ title, content }, authorId, req.file);
                // Send response
                res.status(HttpStatus_1.HttpStatus.CREATED).json({
                    success: true,
                    message: Messages_1.BLOG_MESSAGES.CREATE_SUCCESS,
                    blog
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get all blogs with pagination
         * GET /api/blogs?page=1&limit=10
         * Public route
         */
        this.getAllBlogs = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                // Call service
                const result = await this._blogService.getAllBlogs(page, limit);
                // Send response
                res.status(HttpStatus_1.HttpStatus.OK).json({
                    success: true,
                    ...result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get blog by ID
         * GET /api/blogs/:id
         * Public route
         */
        this.getBlogById = async (req, res, next) => {
            try {
                const { id } = req.params;
                // Call service
                const blog = await this._blogService.getBlogById(id);
                // Send response
                res.status(HttpStatus_1.HttpStatus.OK).json({
                    success: true,
                    blog
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Get blogs by authenticated user
         * GET /api/blogs/user/me
         * Protected route
         */
        this.getBlogsByUser = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                // Call service
                const blogs = await this._blogService.getBlogsByUser(userId);
                // Send response
                res.status(HttpStatus_1.HttpStatus.OK).json({
                    success: true,
                    count: blogs.length,
                    blogs
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Update blog
         * PUT /api/blogs/:id
         * Protected route - ownership verified in service
         */
        this.updateBlog = async (req, res, next) => {
            try {
                // Validate request
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(HttpStatus_1.HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
                    return;
                }
                const { id } = req.params;
                const { title, content } = req.body;
                const userId = req.user.userId;
                // Call service
                const blog = await this._blogService.updateBlog(id, { title, content }, userId, req.file);
                // Send response
                res.status(HttpStatus_1.HttpStatus.OK).json({
                    success: true,
                    message: Messages_1.BLOG_MESSAGES.UPDATE_SUCCESS,
                    blog
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Delete blog
         * DELETE /api/blogs/:id
         * Protected route - ownership verified in service
         */
        this.deleteBlog = async (req, res, next) => {
            try {
                const { id } = req.params;
                const userId = req.user.userId;
                // Call service
                const result = await this._blogService.deleteBlog(id, userId);
                // Send response
                res.status(HttpStatus_1.HttpStatus.OK).json({
                    success: true,
                    ...result
                });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Toggle like on a blog
         * POST /api/blogs/:id/like
         * Protected route
         */
        this.toggleLike = async (req, res, next) => {
            try {
                const { id } = req.params;
                const userId = req.user.userId;
                // Call service
                const blog = await this._blogService.toggleLike(id, userId);
                // Send response
                res.status(HttpStatus_1.HttpStatus.OK).json({
                    success: true,
                    message: blog.likes.some(likeId => likeId.toString() === userId)
                        ? 'Blog liked'
                        : 'Blog unliked',
                    blog
                });
            }
            catch (error) {
                next(error);
            }
        };
        this._blogService = blogService;
    }
}
exports.BlogController = BlogController;
//# sourceMappingURL=BlogController.js.map