"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const UserRepository_1 = require("../repositories/implementations/UserRepository");
const BlogRepository_1 = require("../repositories/implementations/BlogRepository");
const AuthService_1 = require("../services/implementations/AuthService");
const BlogService_1 = require("../services/implementations/BlogService");
const AuthController_1 = require("../controllers/implementations/AuthController");
const BlogController_1 = require("../controllers/implementations/BlogController");
/**
 * Dependency Injection Container
 * Manages all dependencies and wires them together
 * Following Dependency Inversion Principle (DIP)
 * Implements Singleton pattern for instances
 */
class DIContainer {
    constructor() {
        this._instances = new Map();
    }
    /**
     * Get singleton instance of DI container
     */
    static getInstance() {
        if (!DIContainer._instance) {
            DIContainer._instance = new DIContainer();
        }
        return DIContainer._instance;
    }
    /**
     * Get User Repository instance (singleton)
     */
    getUserRepository() {
        if (!this._instances.has('userRepository')) {
            this._instances.set('userRepository', new UserRepository_1.UserRepository());
        }
        return this._instances.get('userRepository');
    }
    /**
     * Get Blog Repository instance (singleton)
     */
    getBlogRepository() {
        if (!this._instances.has('blogRepository')) {
            this._instances.set('blogRepository', new BlogRepository_1.BlogRepository());
        }
        return this._instances.get('blogRepository');
    }
    /**
     * Get Auth Service instance with injected dependencies
     */
    getAuthService() {
        if (!this._instances.has('authService')) {
            this._instances.set('authService', new AuthService_1.AuthService(this.getUserRepository()));
        }
        return this._instances.get('authService');
    }
    /**
     * Get Blog Service instance with injected dependencies
     */
    getBlogService() {
        if (!this._instances.has('blogService')) {
            this._instances.set('blogService', new BlogService_1.BlogService(this.getBlogRepository(), this.getUserRepository()));
        }
        return this._instances.get('blogService');
    }
    /**
     * Get Auth Controller instance with injected dependencies
     */
    getAuthController() {
        if (!this._instances.has('authController')) {
            this._instances.set('authController', new AuthController_1.AuthController(this.getAuthService()));
        }
        return this._instances.get('authController');
    }
    /**
     * Get Blog Controller instance with injected dependencies
     */
    getBlogController() {
        if (!this._instances.has('blogController')) {
            this._instances.set('blogController', new BlogController_1.BlogController(this.getBlogService()));
        }
        return this._instances.get('blogController');
    }
}
// Export singleton instance
exports.container = DIContainer.getInstance();
//# sourceMappingURL=container.js.map