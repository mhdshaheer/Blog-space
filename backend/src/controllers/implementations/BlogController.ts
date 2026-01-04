import { Request, Response, NextFunction } from 'express';
import { IBlogController } from '../interfaces/IBlogController';
import { IBlogService } from '../../services/interfaces/IBlogService';
import { validationResult } from 'express-validator';
import { HttpStatus } from '../../enums/HttpStatus';
import { BLOG_MESSAGES } from '../../constants/Messages';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        username: string;
        email: string;
      };
    }
  }
}

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
        blog
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
        ...result
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

      // Send response
      res.status(HttpStatus.OK).json({
        success: true,
        blog
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
        blogs
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
        blog
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
        ...result
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
        blog
      });
    } catch (error) {
      next(error);
    }
  };
}
