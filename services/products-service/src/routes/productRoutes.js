const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const { authenticate, authorize } = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { productRules } = require('../middleware/validators');

// Public routes
router.get('/', asyncHandler(getProducts));
router.get('/:id', asyncHandler(getProductById));

// Admin-only routes
router.post('/', authenticate, authorize('admin'), productRules, asyncHandler(createProduct));
router.put('/:id', authenticate, authorize('admin'), productRules, asyncHandler(updateProduct));
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(deleteProduct));

module.exports = router;