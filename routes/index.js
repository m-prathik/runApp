const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');

/**
 * @route   GET /
 * @desc    Render home page
 * @access  Public
 */
router.get('/', indexController.getHomePage.bind(indexController));

/**
 * @route   GET /allUsers
 * @desc    Get all users
 * @access  Public
 */
router.get('/allUsers', userController.getAllUsers.bind(userController));

module.exports = router;
