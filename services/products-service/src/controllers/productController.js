const ProductModel = require('../models/productModel');

// POST /api/products  (admin only)
const createProduct = async (req, res) => {
  const { name, description, price, stock, image_url, category_id } = req.body;
  const product = await ProductModel.create({ name, description, price, stock, image_url, category_id });
  res.status(201).json({ message: 'Product created successfully', product });
};

// GET /api/products
const getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const { search, category_id } = req.query;

  const products = await ProductModel.findAll({ limit, offset, search, category_id });
  const total = await ProductModel.countAll({ search, category_id });

  res.json({
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
};

// PUT /api/products/:id  (admin only)
const updateProduct = async (req, res) => {
  const existing = await ProductModel.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { name, description, price, stock, image_url, category_id } = req.body;
  const updated = await ProductModel.update(req.params.id, { name, description, price, stock, image_url, category_id });
  res.json({ message: 'Product updated successfully', product: updated });
};

// DELETE /api/products/:id  (admin only)
const deleteProduct = async (req, res) => {
  const deleted = await ProductModel.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ message: 'Product deleted successfully' });
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};