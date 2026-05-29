const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateLogin, validateAddUser } = require('../middleware/validator');

router.use(express.json());

/**
 * @route   GET /users
 * @desc    Get all users
 * @access  Public
 */
router.get('/', userController.getAllUsers.bind(userController));

/**
 * @route   POST /users/addUser
 * @desc    Create a new user
 * @access  Public
 */
router.post('/addUser', validateAddUser, userController.addUser.bind(userController));

/**
 * @route   POST /users/login
 * @desc    Authenticate user and login
 * @access  Public
 */
router.post('/login', validateLogin, userController.login.bind(userController));

module.exports = router;
