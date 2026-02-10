import { Request, Response, NextFunction } from 'express';
import { IBlogController } from '../interfaces/IBlogController';
import { IBlogService } from '../../services/interfaces/IBlogService';
import { validationResult } from 'express-validator';
import { HttpStatus } from '../../enums/HttpStatus';
import { BLOG_MESSAGES } from '../../constants/Messages';
import { Mapper } from '../../utils/mapper';


/**
 * Blog Controller Implementation
 * Implements IBlogController interface
 * Handles HTTP requests for blog management
 * Following Single Responsibility and Dependency Inversion Principles
 */
export class BlogController implements IBlogController {
  private _blogService: IBlogService;

  constructor(blogService: IBlogService) {
    this._blogService = blogService;
  }

  /**
   * Create a new blog
   * POST /api/blogs
   * Protected route - requires authentication
   */
  createBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
        return;
      }

      if (!req.file) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: BLOG_MESSAGES.IMAGE_REQUIRED });
        return;
      }

      const { title, content } = req.body;
      const authorId = req.user!.userId;

      // Call service
      const blog = await this._blogService.createBlog(
        { title, content },
        authorId,
        req.file
      );

      // Send response
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: BLOG_MESSAGES.CREATE_SUCCESS,
        blog: Mapper.toBlogDto(blog)
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all blogs with pagination
   * GET /api/blogs?page=1&limit=10
   * Public route
   */
  getAllBlogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Call service
      const result = await this._blogService.getAllBlogs(page, limit);

      // Send response
      res.status(HttpStatus.OK).json({
        success: true,
        blogs: Mapper.toBlogDtoList(result.blogs, req.user?.userId),
        total: result.total,
        page: result.page,
        pages: result.pages
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get blog by ID
   * GET /api/blogs/:id
   * Public route
   */
  getBlogById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      // Call service
      const blog = await this._blogService.getBlogById(id);

      if (!blog) {
        res.status(HttpStatus.NOT_FOUND).json({ message: BLOG_MESSAGES.NOT_FOUND });
        return;
      }

      // Send response
      res.status(HttpStatus.OK).json({
        success: true,
        blog: Mapper.toBlogDto(blog, req.user?.userId)
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get blogs by authenticated user
   * GET /api/blogs/user/me
   * Protected route
   */
  getBlogsByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;

      // Call service
      const blogs = await this._blogService.getBlogsByUser(userId);

      // Send response
      res.status(HttpStatus.OK).json({
        success: true,
        count: blogs.length,
        blogs: Mapper.toBlogDtoList(blogs, userId)
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update blog
   * PUT /api/blogs/:id
   * Protected route - ownership verified in service
   */
  updateBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { title, content } = req.body;
      const userId = req.user!.userId;

      // Call service
      const blog = await this._blogService.updateBlog(
        id,
        { title, content },
        userId,
        req.file
      );

      // Send response
      res.status(HttpStatus.OK).json({
        success: true,
        message: BLOG_MESSAGES.UPDATE_SUCCESS,
        blog: Mapper.toBlogDto(blog, userId)
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete blog
   * DELETE /api/blogs/:id
   * Protected route - ownership verified in service
   */
  deleteBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      // Call service
      const result = await this._blogService.deleteBlog(id, userId);

      // Send response
      res.status(HttpStatus.OK).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get favorite blogs for current user
   * GET /api/blogs/user/favorites
   * Protected route
   */
  getFavoriteBlogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;

      // Call service
      const blogs = await this._blogService.getFavoriteBlogs(userId);

      // Send response
      res.status(HttpStatus.OK).json({
        success: true,
        count: blogs.length,
        blogs: Mapper.toBlogDtoList(blogs, userId)
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Toggle like on a blog
   * POST /api/blogs/:id/like
   * Protected route
   */
  toggleLike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      // Call service
      const blog = await this._blogService.toggleLike(id, userId);

      // Send response
      res.status(HttpStatus.OK).json({
        success: true,
        message: blog.likes.some(likeId => likeId.toString() === userId) 
          ? 'Blog liked' 
          : 'Blog unliked',
        blog: Mapper.toBlogDto(blog, userId)
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Toggle dislike on a blog
   * POST /api/blogs/:id/dislike
   * Protected route
   */
  toggleDislike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      // Call service
      const blog = await this._blogService.toggleDislike(id, userId);

      // Send response
      res.status(HttpStatus.OK).json({
        success: true,
        message: blog.dislikes.some(likeId => likeId.toString() === userId) 
          ? 'Blog disliked' 
          : 'Dislike removed',
        blog: Mapper.toBlogDto(blog, userId)
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Toggle favorite on a blog
   * POST /api/blogs/:id/favorite
   * Protected route
   */
  toggleFavorite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      // Call service
      const blog = await this._blogService.toggleFavorite(id, userId);

      // Send response
      res.status(HttpStatus.OK).json({
        success: true,
        message: blog.favorites.some(favId => favId.toString() === userId) 
          ? 'Added to favorites' 
          : 'Removed from favorites',
        blog: Mapper.toBlogDto(blog, userId)
      });
    } catch (error) {
      next(error);
    }
  };
}
