import { Router } from 'express';
import { container } from '../di/container';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { createBlogValidation, updateBlogValidation } from '../validators/blogValidator';

/**
 * Blog Routes
 * Handles blog CRUD operations
 */
const router = Router();
const blogController = container.getBlogController();

/**
 * @route   POST /api/blogs
 * @desc    Create a new blog
 * @access  Private
 */
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  createBlogValidation,
  blogController.createBlog
);

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
router.get('/user/me', authMiddleware, blogController.getBlogsByUser);

/**
 * @route   GET /api/blogs/user/favorites
 * @desc    Get blogs favorited by authenticated user
 * @access  Private
 */
router.get('/user/favorites', authMiddleware, blogController.getFavoriteBlogs);

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
router.put(
  '/:id',
  authMiddleware,
  upload.single('image'),
  updateBlogValidation,
  blogController.updateBlog
);

/**
 * @route   DELETE /api/blogs/:id
 * @desc    Delete blog
 * @access  Private (owner only)
 */
router.delete('/:id', authMiddleware, blogController.deleteBlog);

/**
 * @route   POST /api/blogs/:id/like
 * @desc    Toggle like on a blog
 * @access  Private
 */
router.post('/:id/like', authMiddleware, blogController.toggleLike);

/**
 * @route   POST /api/blogs/:id/dislike
 * @desc    Toggle dislike on a blog
 * @access  Private
 */
router.post('/:id/dislike', authMiddleware, blogController.toggleDislike);

/**
 * @route   POST /api/blogs/:id/favorite
 * @desc    Toggle favorite on a blog
 * @access  Private
 */
router.post('/:id/favorite', authMiddleware, blogController.toggleFavorite);

export default router;
