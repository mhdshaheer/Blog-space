"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = __importDefault(require("../../models/User"));
/**
 * User Repository Implementation
 * Implements IUserRepository interface
 * Handles all database operations for User entity
 * Following Single Responsibility Principle (SRP)
 */
class UserRepository {
    /**
     * Create a new user in the database
     * @param userData - User data
     * @returns Created user
     */
    async createUser(userData) {
        try {
            const user = new User_1.default(userData);
            await user.save();
            return user;
        }
        catch (error) {
            const mongoError = error;
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
    async findUserByEmail(email) {
        try {
            const user = await User_1.default.findOne({ email: email.toLowerCase() });
            return user;
        }
        catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }
    /**
     * Find user by ID
     * @param id - User ID
     * @returns User or null
     */
    async findUserById(id) {
        try {
            const user = await User_1.default.findById(id).select('-password');
            return user;
        }
        catch (error) {
            throw new Error(`Error finding user by ID: ${error.message}`);
        }
    }
    /**
     * Find user by username
     * @param username - Username
     * @returns User or null
     */
    async findUserByUsername(username) {
        try {
            const user = await User_1.default.findOne({ username });
            return user;
        }
        catch (error) {
            throw new Error(`Error finding user by username: ${error.message}`);
        }
    }
    /**
     * Update user information
     * @param id - User ID
     * @param updateData - Data to update
     * @returns Updated user
     */
    async updateUser(id, updateData) {
        try {
            const user = await User_1.default.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true }).select('-password');
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        }
        catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }
    /**
     * Delete user from database
     * @param id - User ID
     * @returns Success status
     */
    async deleteUser(id) {
        try {
            const result = await User_1.default.findByIdAndDelete(id);
            return result !== null;
        }
        catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map