const express = require('express');
const router = express.Router();

const {
  register,
  login,
  refresh,
  getProfile,
  updateProfile,
  listUsers,
} = require('../controllers/userController');

const { authenticate, authorize } = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { registerRules, loginRules, updateProfileRules } = require('../middleware/validators');

// Public routes
router.post('/register', registerRules, asyncHandler(register));
router.post('/login', loginRules, asyncHandler(login));
router.post('/refresh', asyncHandler(refresh));

// Authenticated user routes
router.get('/me', authenticate, asyncHandler(getProfile));
router.put('/me', authenticate, updateProfileRules, asyncHandler(updateProfile));

// Admin-only routes
router.get('/', authenticate, authorize('admin'), asyncHandler(listUsers));

module.exports = router;