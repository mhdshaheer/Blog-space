"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../di/container");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const blogValidator_1 = require("../validators/blogValidator");
/**
 * Blog Routes
 * Handles blog CRUD operations
 */
const router = (0, express_1.Router)();
const blogController = container_1.container.getBlogController();
/**
 * @route   POST /api/blogs
 * @desc    Create a new blog
 * @access  Private
 */
router.post('/', auth_1.authMiddleware, upload_1.upload.single('image'), blogValidator_1.createBlogValidation, blogController.createBlog);
/**
 * @route   GET /api/blogs
 * @desc    Get all blogs with pagination
 * @access  Public
 */
router.get('/', blogController.getAllBlogs);
/**
 * @route   GET /api/blogs/user/me
 * @desc    Get blogs by authenticated user
 * @access  Private
 */
router.get('/user/me', auth_1.authMiddleware, blogController.getBlogsByUser);
/**
 * @route   GET /api/blogs/user/favorites
 * @desc    Get blogs favorited by authenticated user
 * @access  Private
 */
router.get('/user/favorites', auth_1.authMiddleware, blogController.getFavoriteBlogs);
/**
 * @route   GET /api/blogs/:id
 * @desc    Get blog by ID
 * @access  Public
 */
router.get('/:id', blogController.getBlogById);
/**
 * @route   PUT /api/blogs/:id
 * @desc    Update blog
 * @access  Private (owner only)
 */
router.put('/:id', auth_1.authMiddleware, upload_1.upload.single('image'), blogValidator_1.updateBlogValidation, blogController.updateBlog);
/**
 * @route   DELETE /api/blogs/:id
 * @desc    Delete blog
 * @access  Private (owner only)
 */
router.delete('/:id', auth_1.authMiddleware, blogController.deleteBlog);
/**
 * @route   POST /api/blogs/:id/like
 * @desc    Toggle like on a blog
 * @access  Private
 */
router.post('/:id/like', auth_1.authMiddleware, blogController.toggleLike);
exports.default = router;
//# sourceMappingURL=blogRoutes.js.map