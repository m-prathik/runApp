/**
 * Input validation middleware
 * Validates request data before processing
 */

const { ValidationError } = require('../utils/errors');

const validateLogin = (req, res, next) => {
  const { userName, password } = req.body;

  if (!userName || typeof userName !== 'string' || userName.trim().length === 0) {
    return next(new ValidationError('Username is required and must be a non-empty string'));
  }

  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    return next(new ValidationError('Password is required and must be a non-empty string'));
  }

  next();
};

const validateAddUser = (req, res, next) => {
  const { name, userName, password, role } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 5) {
    return next(new ValidationError('Name is required and must be at least 5 characters long'));
  }

  if (!userName || typeof userName !== 'string' || userName.trim().length === 0) {
    return next(new ValidationError('Username is required and must be a non-empty string'));
  }

  if (!password || typeof password !== 'string') {
    return next(new ValidationError('Password is required'));
  }
  if (!role || typeof role !== 'string' || role.trim().length === 0) {
    return next(new ValidationError('Role is required and must be a non-empty string'));
  }

  next();
};

module.exports = {
  validateLogin,
  validateAddUser,
};

