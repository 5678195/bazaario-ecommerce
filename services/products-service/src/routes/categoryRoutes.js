const express = require('express');
const router = express.Router();

const {
  createCategory,
  getCategories,
  deleteCategory,
} = require('../controllers/categoryController');

const { authenticate, authorize } = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { categoryRules } = require('../middleware/validators');

// Public route
router.get('/', asyncHandler(getCategories));

// Admin-only routes
router.post('/', authenticate, authorize('admin'), categoryRules, asyncHandler(createCategory));
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(deleteCategory));

module.exports = router;