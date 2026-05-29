/**
 * User Service
 * Contains business logic for user operations
 * Implements Service Layer Pattern
 */

const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const { AuthenticationError, ValidationError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Password validation regex
 * Requires: at least one uppercase letter, one digit, and minimum 8 characters
 */
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

class UserService {
  /**
   * Get all users
   * @returns {Promise<Array>} Array of users (without passwords)
   */
  async getAllUsers() {
    try {
      return await userRepository.findAll();
    } catch (error) {
      logger.error('Error in getAllUsers service:', error);
      throw error;
    }
  }

  /**
   * Create a new user with hashed password
   * @param {Object} userData - User data including password
   * @returns {Promise<Object>} Created user (without password)
   */
  async createUser(userData) {
    try {
      // Check if user already exists
      const userExists = await userRepository.existsByUsername(userData.userName);
      if (userExists) {
        throw new ValidationError('Username already exists');
      }
	  logger.info(userData.password);
	if (!passwordRegex.test(userData.password)) {
      throw new ValidationError(
        'Invalid password. Must contain 1 uppercase, 1 number, min 8 chars'
      );
    }
      // Hash password before saving
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const userToCreate = {
        ...userData,
        password: hashedPassword,
      };

      const user = await userRepository.create(userToCreate);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      logger.error('Error in createUser service:', error);
      throw error;
    }
  }

  /**
   * Authenticate user login
   * @param {string} userName - Username
   * @param {string} password - Plain text password
   * @returns {Promise<Object>} User object if authentication succeeds
   * @throws {AuthenticationError} If authentication fails
   */
  async authenticateUser(userName, password) {
    try {
      // Include password in query for authentication
      const user = await userRepository.findByUsername(userName, true);
      
      if (!user) {
        throw new AuthenticationError('Invalid username or password');
      }

      // Compare provided password with hashed password
	  logger.info('db password ', user);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
		logger.error("user not found");
        throw new AuthenticationError('Invalid username or password');
      }

      // Return user without password
      const userObj = user.toObject ? user.toObject() : user;
      const { password: _, ...userWithoutPassword } = userObj;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      logger.error('Error in authenticateUser service:', error);
      throw new AuthenticationError('Authentication failed');
    }
  }
}

module.exports = new UserService();

