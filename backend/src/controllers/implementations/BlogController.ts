import { Request, Response, NextFunction } from 'express';
import { IBlogController } from '../interfaces/IBlogController';
import { IBlogService } from '../../services/interfaces/IBlogService';
import { validationResult } from 'express-validator';
import { HttpStatus } from '../../enums/HttpStatus';
import { BLOG_MESSAGES } from '../../constants/Messages';
import { CreateBlogRequestDto, UpdateBlogRequestDto } from '../../dtos/BlogDto';


/**
 * Blog Controller Implementation
 */
export class BlogController implements IBlogController {
  private _blogService: IBlogService;

  constructor(blogService: IBlogService) {
    this._blogService = blogService;
  }

  /**
   * Create a new blog
   */
  createBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
        return;
      }

      if (!req.file) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: BLOG_MESSAGES.IMAGE_REQUIRED });
        return;
      }

      const blogData: CreateBlogRequestDto = {
        title: req.body.title,
        content: req.body.content
      };
      
      const authorId = req.user!.userId;
      const blog = await this._blogService.createBlog(blogData, authorId, req.file);

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
   * Get all blogs with pagination (Summarized)
   */
  getAllBlogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const userId = req.user?.userId;

      const result = await this._blogService.getAllBlogs(page, limit, {}, userId);

      res.status(HttpStatus.OK).json({
        success: true,
        blogs: result.blogs,
        total: result.total,
        page: result.page,
        pages: result.pages
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get detailed blog by ID
   */
  getBlogById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const blog = await this._blogService.getBlogById(id, userId);
      if (!blog) {
        res.status(HttpStatus.NOT_FOUND).json({ message: BLOG_MESSAGES.NOT_FOUND });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        blog
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get blogs by user (Summarized for profile)
   */
  getBlogsByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const blogs = await this._blogService.getBlogsByUser(userId);

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
   */
  updateBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const updateData: UpdateBlogRequestDto = {
        title: req.body.title,
        content: req.body.content
      };
      
      const userId = req.user!.userId;
      const blog = await this._blogService.updateBlog(id, updateData, userId, req.file);

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
   */
  deleteBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const result = await this._blogService.deleteBlog(id, userId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get favorites (Summarized)
   */
  getFavoriteBlogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const blogs = await this._blogService.getFavoriteBlogs(userId);

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
   * Toggle like
   */
  toggleLike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const blog = await this._blogService.toggleLike(id, userId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: blog.isLiked ? 'Blog liked' : 'Blog unliked',
        blog
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Toggle dislike
   */
  toggleDislike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const blog = await this._blogService.toggleDislike(id, userId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: blog.isDisliked ? 'Blog disliked' : 'Dislike removed',
        blog
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Toggle favorite
   */
  toggleFavorite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const blog = await this._blogService.toggleFavorite(id, userId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: blog.isFavorited ? 'Added to favorites' : 'Removed from favorites',
        blog
      });
    } catch (error) {
      next(error);
    }
  };
}
