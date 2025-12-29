import { IBlogRepository, BlogQueryOptions } from '../interfaces/IBlogRepository';
import Blog, { IBlog } from '../../models/Blog';

/**
 * Blog Repository Implementation
 * Implements IBlogRepository interface
 * Handles all database operations for Blog entity
 * Following Single Responsibility Principle (SRP)
 */
export class BlogRepository implements IBlogRepository {
  /**
   * Create a new blog in the database
   * @param blogData - Blog data
   * @returns Created blog
   */
  async createBlog(blogData: Partial<IBlog>): Promise<IBlog> {
    try {
      const blog = new Blog(blogData);
      await blog.save();
      // Populate author details
      await blog.populate('author', '-password');
      return blog;
    } catch (error) {
      throw new Error(`Error creating blog: ${(error as Error).message}`);
    }
  }

  /**
   * Find all blogs with pagination and filters
   * @param options - Query options
   * @returns Array of blogs
   */
  async findAllBlogs(options: BlogQueryOptions): Promise<IBlog[]> {
    try {
      const { skip = 0, limit = 10, filters = {}, sort = { createdAt: -1 } } = options;
      
      const blogs = await Blog.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('author', '-password')
        .exec();
      
      return blogs;
    } catch (error) {
      throw new Error(`Error finding blogs: ${(error as Error).message}`);
    }
  }

  /**
   * Find blog by ID
   * @param id - Blog ID
   * @returns Blog or null
   */
  async findBlogById(id: string): Promise<IBlog | null> {
    try {
      const blog = await Blog.findById(id)
        .populate('author', '-password')
        .exec();
      
      return blog;
    } catch (error) {
      throw new Error(`Error finding blog by ID: ${(error as Error).message}`);
    }
  }

  /**
   * Find all blogs by author
   * @param authorId - Author ID
   * @returns Array of blogs
   */
  async findBlogsByAuthor(authorId: string): Promise<IBlog[]> {
    try {
      const blogs = await Blog.find({ author: authorId })
        .sort({ createdAt: -1 })
        .populate('author', '-password')
        .exec();
      
      return blogs;
    } catch (error) {
      throw new Error(`Error finding blogs by author: ${(error as Error).message}`);
    }
  }

  /**
   * Update blog information
   * @param id - Blog ID
   * @param updateData - Data to update
   * @returns Updated blog
   */
  async updateBlog(id: string, updateData: Partial<IBlog>): Promise<IBlog> {
    try {
      const blog = await Blog.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('author', '-password');
      
      if (!blog) {
        throw new Error('Blog not found');
      }
      
      return blog;
    } catch (error) {
      throw new Error(`Error updating blog: ${(error as Error).message}`);
    }
  }

  /**
   * Delete blog from database
   * @param id - Blog ID
   * @returns Success status
   */
  async deleteBlog(id: string): Promise<boolean> {
    try {
      const result = await Blog.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw new Error(`Error deleting blog: ${(error as Error).message}`);
    }
  }

  /**
   * Count total blogs
   * @param filters - Query filters
   * @returns Total count
   */
  async countBlogs(filters: Record<string, any> = {}): Promise<number> {
    try {
      const count = await Blog.countDocuments(filters);
      return count;
    } catch (error) {
      throw new Error(`Error counting blogs: ${(error as Error).message}`);
    }
  }
}
