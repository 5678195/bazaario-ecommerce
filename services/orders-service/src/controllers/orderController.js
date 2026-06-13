const OrderModel = require('../models/orderModel');

const placeOrder = async (req, res) => {
  try {
    const { items, total, shipping_address } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }
    if (!shipping_address) {
      return res.status(400).json({ error: 'Shipping address required' });
    }
    const order = await OrderModel.createOrder(req.user.id, { items, total, shipping_address });
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await OrderModel.getOrdersByUser(req.user.id);
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await OrderModel.getOrderById(req.params.id, req.user.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const orders = await OrderModel.getAllOrders();
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const order = await OrderModel.updateStatus(req.params.id, status);
    res.json({ message: 'Status updated', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders };
