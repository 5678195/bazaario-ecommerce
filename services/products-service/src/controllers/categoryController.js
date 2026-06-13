const CategoryModel = require('../models/categoryModel');

// POST /api/categories  (admin only)
const createCategory = async (req, res) => {
  const { name } = req.body;
  const category = await CategoryModel.create({ name });
  res.status(201).json({ message: 'Category created successfully', category });
};

// GET /api/categories
const getCategories = async (req, res) => {
  const categories = await CategoryModel.findAll();
  res.json({ categories });
};

// DELETE /api/categories/:id  (admin only)
const deleteCategory = async (req, res) => {
  const deleted = await CategoryModel.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json({ message: 'Category deleted successfully' });
};

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
};