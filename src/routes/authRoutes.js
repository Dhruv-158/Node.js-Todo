const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

// Register user
router.post(
  '/register',
  [
    check('firstName', 'First name is required').not().isEmpty().trim(),
    check('lastName', 'Last name is required').not().isEmpty().trim(),
    check('username', 'Username is required').not().isEmpty().trim(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  validateRequest,
  authController.register
);

// Login user
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  validateRequest,
  authController.login
);

// Logout user
router.post('/logout', authenticate, authController.logout);

// Get current user
router.get('/:id', authenticate, authController.getUser);

module.exports = router;