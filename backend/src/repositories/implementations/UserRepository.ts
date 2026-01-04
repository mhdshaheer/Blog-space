import { IUserRepository } from '../interfaces/IUserRepository';
import User, { IUser } from '../../models/User';

/**
 * User Repository Implementation
 * Implements IUserRepository interface
 * Handles all database operations for User entity
 * Following Single Responsibility Principle (SRP)
 */
export class UserRepository implements IUserRepository {
  /**
   * Create a new user in the database
   * @param userData - User data
   * @returns Created user
   */
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error: unknown) {
      const mongoError = error as { code?: number; keyPattern?: Record<string, number> };
      if (mongoError.code === 11000 && mongoError.keyPattern) {
        // Duplicate key error
        const field = Object.keys(mongoError.keyPattern)[0];
        throw new Error(`${field} already exists`);
      }
      throw error;
    }
  }

  /**
   * Find user by email
   * @param email - User email
   * @returns User or null
   */
  async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      return user;
    } catch (error) {
      throw new Error(`Error finding user by email: ${(error as Error).message}`);
    }
  }

  /**
   * Find user by ID
   * @param id - User ID
   * @returns User or null
   */
  async findUserById(id: string): Promise<IUser | null> {
    try {
      const user = await User.findById(id).select('-password');
      return user;
    } catch (error) {
      throw new Error(`Error finding user by ID: ${(error as Error).message}`);
    }
  }

  /**
   * Find user by username
   * @param username - Username
   * @returns User or null
   */
  async findUserByUsername(username: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ username });
      return user;
    } catch (error) {
      throw new Error(`Error finding user by username: ${(error as Error).message}`);
    }
  }

  /**
   * Update user information
   * @param id - User ID
   * @param updateData - Data to update
   * @returns Updated user
   */
  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser> {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      throw new Error(`Error updating user: ${(error as Error).message}`);
    }
  }

  /**
   * Delete user from database
   * @param id - User ID
   * @returns Success status
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw new Error(`Error deleting user: ${(error as Error).message}`);
    }
  }
}
