import { UserRepository } from '../repositories/implementations/UserRepository';
import { BlogRepository } from '../repositories/implementations/BlogRepository';
import { AuthService } from '../services/implementations/AuthService';
import { BlogService } from '../services/implementations/BlogService';
import { AuthController } from '../controllers/implementations/AuthController';
import { BlogController } from '../controllers/implementations/BlogController';

/**
 * Dependency Injection Container
 * Manages all dependencies and wires them together
 * Following Dependency Inversion Principle (DIP)
 * Implements Singleton pattern for instances
 */
class DIContainer {
  private static instance: DIContainer;
  private instances: Map<string, any>;

  private constructor() {
    this.instances = new Map();
  }

  /**
   * Get singleton instance of DI container
   */
  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  /**
   * Get User Repository instance (singleton)
   */
  getUserRepository(): UserRepository {
    if (!this.instances.has('userRepository')) {
      this.instances.set('userRepository', new UserRepository());
    }
    return this.instances.get('userRepository');
  }

  /**
   * Get Blog Repository instance (singleton)
   */
  getBlogRepository(): BlogRepository {
    if (!this.instances.has('blogRepository')) {
      this.instances.set('blogRepository', new BlogRepository());
    }
    return this.instances.get('blogRepository');
  }

  /**
   * Get Auth Service instance with injected dependencies
   */
  getAuthService(): AuthService {
    if (!this.instances.has('authService')) {
      this.instances.set(
        'authService',
        new AuthService(this.getUserRepository())
      );
    }
    return this.instances.get('authService');
  }

  /**
   * Get Blog Service instance with injected dependencies
   */
  getBlogService(): BlogService {
    if (!this.instances.has('blogService')) {
      this.instances.set(
        'blogService',
        new BlogService(
          this.getBlogRepository(),
          this.getUserRepository()
        )
      );
    }
    return this.instances.get('blogService');
  }

  /**
   * Get Auth Controller instance with injected dependencies
   */
  getAuthController(): AuthController {
    if (!this.instances.has('authController')) {
      this.instances.set(
        'authController',
        new AuthController(this.getAuthService())
      );
    }
    return this.instances.get('authController');
  }

  /**
   * Get Blog Controller instance with injected dependencies
   */
  getBlogController(): BlogController {
    if (!this.instances.has('blogController')) {
      this.instances.set(
        'blogController',
        new BlogController(this.getBlogService())
      );
    }
    return this.instances.get('blogController');
  }
}

// Export singleton instance
export const container = DIContainer.getInstance();
