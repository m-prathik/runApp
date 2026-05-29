/**
 * User Repository
 * Handles all database operations for users
 * Implements Repository Pattern for data access abstraction
 */

const { userTable } = require('../db/model/userModel');
const { NotFoundError } = require('../utils/errors');
const logger = require('../utils/logger');

class UserRepository {
  /**
   * Find all users
   * @returns {Promise<Array>} Array of users
   */
  async findAll() {
    try {
      return await userTable.find().select('-password'); // Exclude password from results
    } catch (error) {
      logger.error('Error finding all users:', error);
      throw error;
    }
  }

  /**
   * Find user by username
   * @param {string} userName - Username to search for
   * @param {boolean} includePassword - Whether to include password in result
   * @returns {Promise<Object|null>} User object or null if not found
   */
  async findByUsername(userName, includePassword = false) {
    try {
      const query = userTable.findOne({ userName });
      if (includePassword) {
        return await query.select('+password'); // Use + to override select: false
      }
      return await query;
    } catch (error) {
      logger.error(`Error finding user by username ${userName}:`, error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data to create
   * @returns {Promise<Object>} Created user
   */
  async create(userData) {
    try {
      const user = new userTable(userData);
      await user.validate();
      const savedUser = await user.save();
      return savedUser.toObject();
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Check if user exists by username
   * @param {string} userName - Username to check
   * @returns {Promise<boolean>} True if user exists, false otherwise
   */
  async existsByUsername(userName) {
    try {
      const user = await userTable.findOne({ userName });
      return user !== null;
    } catch (error) {
      logger.error(`Error checking if user exists ${userName}:`, error);
      throw error;
    }
  }
}

module.exports = new UserRepository();

