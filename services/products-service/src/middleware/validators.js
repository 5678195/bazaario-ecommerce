const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(e => ({ field: e.path, message: e.msg })) });
  }
  next();
};

const productRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 150 }),
  body('description').optional().trim(),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('image_url').optional().trim().isLength({ max: 255 }),
  body('category_id').optional().isInt().withMessage('Category ID must be an integer'),
  validate,
];

const categoryRules = [
  body('name').trim().notEmpty().withMessage('Category name is required').isLength({ max: 100 }),
  validate,
];

module.exports = { productRules, categoryRules };