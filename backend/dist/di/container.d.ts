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
declare class DIContainer {
    private static _instance;
    private _instances;
    private constructor();
    /**
     * Get singleton instance of DI container
     */
    static getInstance(): DIContainer;
    /**
     * Get User Repository instance (singleton)
     */
    getUserRepository(): UserRepository;
    /**
     * Get Blog Repository instance (singleton)
     */
    getBlogRepository(): BlogRepository;
    /**
     * Get Auth Service instance with injected dependencies
     */
    getAuthService(): AuthService;
    /**
     * Get Blog Service instance with injected dependencies
     */
    getBlogService(): BlogService;
    /**
     * Get Auth Controller instance with injected dependencies
     */
    getAuthController(): AuthController;
    /**
     * Get Blog Controller instance with injected dependencies
     */
    getBlogController(): BlogController;
}
export declare const container: DIContainer;
export {};
//# sourceMappingURL=container.d.ts.map