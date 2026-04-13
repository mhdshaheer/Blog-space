import { UserRepository } from '../repositories/implementations/UserRepository';
import { BlogRepository } from '../repositories/implementations/BlogRepository';
import { AuthService } from '../services/implementations/AuthService';
import { BlogService } from '../services/implementations/BlogService';
import { AuthController } from '../controllers/implementations/AuthController';
import { BlogController } from '../controllers/implementations/BlogController';
import { MailService } from '../services/implementations/MailService';
import { CacheService } from '../services/implementations/CacheService';
import { TokenService } from '../services/implementations/TokenService';
import { StorageService } from '../services/implementations/StorageService';

/**
 * Dependency Injection Container
 * Manages all dependencies and wires them together
 * Following Dependency Inversion Principle (DIP)
 * Implements Singleton pattern for instances
 */
class DIContainer {
  private static _instance: DIContainer;
  private _instances: Map<string, object>;

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
   * Get Mail Service instance (singleton)
   */
  getMailService(): MailService {
    if (!this._instances.has('mailService')) {
      this._instances.set('mailService', new MailService());
    }
    return this._instances.get('mailService') as MailService;
  }

  /**
   * Get Cache Service instance (singleton)
   */
  getCacheService(): CacheService {
    if (!this._instances.has('cacheService')) {
      this._instances.set('cacheService', new CacheService());
    }
    return this._instances.get('cacheService') as CacheService;
  }

  /**
   * Get Token Service instance (singleton)
   */
  getTokenService(): TokenService {
    if (!this._instances.has('tokenService')) {
      this._instances.set('tokenService', new TokenService());
    }
    return this._instances.get('tokenService') as TokenService;
  }

  /**
   * Get Storage Service instance (singleton)
   */
  getStorageService(): StorageService {
    if (!this._instances.has('storageService')) {
      this._instances.set('storageService', new StorageService());
    }
    return this._instances.get('storageService') as StorageService;
  }

  /**
   * Get User Repository instance (singleton)
   */
  getUserRepository(): UserRepository {
    if (!this._instances.has('userRepository')) {
      this._instances.set('userRepository', new UserRepository());
    }
    return this._instances.get('userRepository') as UserRepository;
  }

  /**
   * Get Blog Repository instance (singleton)
   */
  getBlogRepository(): BlogRepository {
    if (!this._instances.has('blogRepository')) {
      this._instances.set('blogRepository', new BlogRepository());
    }
    return this._instances.get('blogRepository') as BlogRepository;
  }

  /**
   * Get Auth Service instance with injected dependencies
   */
  getAuthService(): AuthService {
    if (!this._instances.has('authService')) {
      this._instances.set(
        'authService',
        new AuthService(
          this.getUserRepository(),
          this.getMailService(),
          this.getCacheService(),
          this.getTokenService()
        )
      );
    }
    return this._instances.get('authService') as AuthService;
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
          this.getUserRepository(),
          this.getStorageService()
        )
      );
    }
    return this._instances.get('blogService') as BlogService;
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
    return this._instances.get('authController') as AuthController;
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
    return this._instances.get('blogController') as BlogController;
  }
}

// Export singleton instance
export const container = DIContainer.getInstance();
