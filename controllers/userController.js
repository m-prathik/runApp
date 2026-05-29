/**
 * User Controller
 * Handles HTTP requests and responses for user-related endpoints
 * Implements Controller Pattern
 */

const userService = require('../services/userService');
const logger = require('../utils/logger');

class UserController {
  /**
   * Get all users
   * GET /users
   */
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new user
   * POST /users/addUser
   */
  async addUser(req, res, next) {
    try {
      logger.info('Add user request received', { userName: req.body.userName });
      const user = await userService.createUser(req.body);
      res.status(201).json({
        success: true,
        message: 'User successfully created',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Authenticate user login
   * POST /users/login
   */
  async login(req, res, next) {
    try {
      logger.info('Login request received', { userName: req.body.userName , password : req.body.password});
      const { userName, password } = req.body;
      const user = await userService.authenticateUser(userName, password);
      res.status(200).json({
        success: true,
        message: 'User successfully logged in',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();

