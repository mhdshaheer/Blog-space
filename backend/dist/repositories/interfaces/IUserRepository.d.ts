import { IUser } from '../../models/User';
/**
 * User Repository Interface
 * Defines the contract for user data access operations
 * Following Interface Segregation Principle (ISP)
 */
export interface IUserRepository {
    /**
     * Create a new user
     * @param userData - User data object
     * @returns Created user
     */
    createUser(userData: Partial<IUser>): Promise<IUser>;
    /**
     * Find user by email
     * @param email - User email
     * @returns User object or null
     */
    findUserByEmail(email: string): Promise<IUser | null>;
    /**
     * Find user by ID
     * @param id - User ID
     * @returns User object or null
     */
    findUserById(id: string): Promise<IUser | null>;
    /**
     * Find user by username
     * @param username - Username
     * @returns User object or null
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
     * Delete user
     * @param id - User ID
     * @returns Success status
     */
    deleteUser(id: string): Promise<boolean>;
}
//# sourceMappingURL=IUserRepository.d.ts.map