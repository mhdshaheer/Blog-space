import { IUserRepository } from '../interfaces/IUserRepository';
import { IUser } from '../../models/User';
/**
 * User Repository Implementation
 * Implements IUserRepository interface
 * Handles all database operations for User entity
 * Following Single Responsibility Principle (SRP)
 */
export declare class UserRepository implements IUserRepository {
    /**
     * Create a new user in the database
     * @param userData - User data
     * @returns Created user
     */
    createUser(userData: Partial<IUser>): Promise<IUser>;
    /**
     * Find user by email
     * @param email - User email
     * @returns User or null
     */
    findUserByEmail(email: string): Promise<IUser | null>;
    /**
     * Find user by ID
     * @param id - User ID
     * @returns User or null
     */
    findUserById(id: string): Promise<IUser | null>;
    /**
     * Find user by username
     * @param username - Username
     * @returns User or null
     */
    findUserByUsername(username: string): Promise<IUser | null>;
    /**
     * Update user information
     * @param id - User ID
     * @param updateData - Data to update
     * @returns Updated user
     */
    updateUser(id: string, updateData: Partial<IUser>): Promise<IUser>;
    /**
     * Delete user from database
     * @param id - User ID
     * @returns Success status
     */
    deleteUser(id: string): Promise<boolean>;
}
//# sourceMappingURL=UserRepository.d.ts.map