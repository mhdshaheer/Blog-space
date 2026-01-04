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
  private static _instance: DIContainer;
  private _instances: Map<string, any>;

  private constructor() {
    this._instances = new Map();
  }

  /**
   * Get singleton instance of DI container
   */
  public static getInstance(): DIContainer {
    if (!DIContainer._instance) {
      DIContainer._instance = new DIContainer();
    }
    return DIContainer._instance;
  }

  /**
   * Get User Repository instance (singleton)
   */
  getUserRepository(): UserRepository {
    if (!this._instances.has('userRepository')) {
      this._instances.set('userRepository', new UserRepository());
    }
    return this._instances.get('userRepository');
  }

  /**
   * Get Blog Repository instance (singleton)
   */
  getBlogRepository(): BlogRepository {
    if (!this._instances.has('blogRepository')) {
      this._instances.set('blogRepository', new BlogRepository());
    }
    return this._instances.get('blogRepository');
  }

  /**
   * Get Auth Service instance with injected dependencies
   */
  getAuthService(): AuthService {
    if (!this._instances.has('authService')) {
      this._instances.set(
        'authService',
        new AuthService(this.getUserRepository())
      );
    }
    return this._instances.get('authService');
  }

  /**
   * Get Blog Service instance with injected dependencies
   */
  getBlogService(): BlogService {
    if (!this._instances.has('blogService')) {
      this._instances.set(
        'blogService',
        new BlogService(
          this.getBlogRepository(),
          this.getUserRepository()
        )
      );
    }
    return this._instances.get('blogService');
  }

  /**
   * Get Auth Controller instance with injected dependencies
   */
  getAuthController(): AuthController {
    if (!this._instances.has('authController')) {
      this._instances.set(
        'authController',
        new AuthController(this.getAuthService())
      );
    }
    return this._instances.get('authController');
  }

  /**
   * Get Blog Controller instance with injected dependencies
   */
  getBlogController(): BlogController {
    if (!this._instances.has('blogController')) {
      this._instances.set(
        'blogController',
        new BlogController(this.getBlogService())
      );
    }
    return this._instances.get('blogController');
  }
}

// Export singleton instance
export const container = DIContainer.getInstance();
