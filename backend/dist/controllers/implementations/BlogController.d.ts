import { Request, Response, NextFunction } from 'express';
import { IBlogController } from '../interfaces/IBlogController';
import { IBlogService } from '../../services/interfaces/IBlogService';
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
export declare class BlogController implements IBlogController {
    private blogService;
    constructor(blogService: IBlogService);
    /**
     * Create a new blog
     * POST /api/blogs
     * Protected route - requires authentication
     */
    createBlog: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get all blogs with pagination
     * GET /api/blogs?page=1&limit=10
     * Public route
     */
    getAllBlogs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get blog by ID
     * GET /api/blogs/:id
     * Public route
     */
    getBlogById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Get blogs by authenticated user
     * GET /api/blogs/user/me
     * Protected route
     */
    getBlogsByUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Update blog
     * PUT /api/blogs/:id
     * Protected route - ownership verified in service
     */
    updateBlog: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Delete blog
     * DELETE /api/blogs/:id
     * Protected route - ownership verified in service
     */
    deleteBlog: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=BlogController.d.ts.map