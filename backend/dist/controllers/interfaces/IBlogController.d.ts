import { Request, Response, NextFunction } from 'express';
/**
 * Blog Controller Interface
 * Defines HTTP handler contract for blog management
 * Following Interface Segregation Principle (ISP)
 */
export interface IBlogController {
    /**
     * Create a new blog
     */
    createBlog(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get all blogs with pagination
     */
    getAllBlogs(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get blog by ID
     */
    getBlogById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get blogs by authenticated user
     */
    getBlogsByUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update blog
     */
    updateBlog(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete blog
     */
    deleteBlog(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get favorite blogs for current user
     */
    getFavoriteBlogs(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Toggle like on a blog
     */
    toggleLike(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=IBlogController.d.ts.map