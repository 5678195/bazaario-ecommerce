const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders } = require('../controllers/orderController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, placeOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/admin/all', authenticate, getAllOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/status', authenticate, updateOrderStatus);

module.exports = router;
