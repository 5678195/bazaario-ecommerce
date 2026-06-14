const pool = require('../config/db');

class OrderModel {
  static async createOrder(userId, { items, total, shipping_address }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const orderRes = await client.query(
        'INSERT INTO orders (user_id, total_amount, shipping_address, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, total, shipping_address, 'pending']
      );
      const order = orderRes.rows[0];
      for (const item of items) {
        await client.query(
          'INSERT INTO order_items (order_id, product_id, product_name, product_price, image_url, quantity) VALUES ($1, $2, $3, $4, $5, $6)',
          [order.id, item.product_id, item.product_name, item.product_price, item.image_url, item.quantity]
        );
      }
      await client.query('COMMIT');
      return order;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  static async getOrdersByUser(userId) {
    const orders = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    for (const order of orders.rows) {
      const items = await pool.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [order.id]
      );
      order.items = items.rows;
    }
    return orders.rows;
  }

  static async getOrderById(orderId, userId) {
    const orderRes = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, userId]
    );
    if (orderRes.rows.length === 0) return null;
    const order = orderRes.rows[0];
    const items = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [order.id]
    );
    order.items = items.rows;
    return order;
  }

  static async getAllOrders() {
    const orders = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );
    for (const order of orders.rows) {
      const items = await pool.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [order.id]
      );
      order.items = items.rows;
    }
    return orders.rows;
  }

  static async updateStatus(orderId, status) {
    const res = await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, orderId]
    );
    return res.rows[0];
  }
}

module.exports = OrderModel;
