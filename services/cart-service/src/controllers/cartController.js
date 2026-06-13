const CartModel = require('../models/cartModel');

const getCart = async (req, res) => {
  const cart = await CartModel.getCartWithItems(req.user.id);
  const total = cart.items.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
  res.json({ cart: { ...cart, total } });
};

const addItem = async (req, res) => {
  const { product_id, product_name, product_price, image_url, quantity } = req.body;
  if (!product_id || !product_name || !product_price) {
    return res.status(400).json({ error: 'product_id, product_name, product_price required' });
  }
  const item = await CartModel.addItem(req.user.id, { product_id, product_name, product_price, image_url, quantity });
  res.status(201).json({ message: 'Item added to cart', item });
};

const updateItem = async (req, res) => {
  const { quantity } = req.body;
  if (quantity === undefined) return res.status(400).json({ error: 'quantity required' });
  const item = await CartModel.updateQuantity(req.user.id, req.params.productId, quantity);
  res.json({ message: 'Cart updated', item });
};

const removeItem = async (req, res) => {
  await CartModel.removeItem(req.user.id, req.params.productId);
  res.json({ message: 'Item removed from cart' });
};

const clearCart = async (req, res) => {
  await CartModel.clearCart(req.user.id);
  res.json({ message: 'Cart cleared' });
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
