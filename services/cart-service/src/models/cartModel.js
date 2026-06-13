const pool = require('../config/db');

class CartModel {
  static async getOrCreateCart(userId) {
    let result = await pool.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
    if (result.rows.length === 0) {
      result = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING *', [userId]);
    }
    return result.rows[0];
  }

  static async getCartWithItems(userId) {
    const cart = await this.getOrCreateCart(userId);
    const items = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1 ORDER BY created_at ASC', [cart.id]);
    return { ...cart, items: items.rows };
  }

  static async addItem(userId, { product_id, product_name, product_price, image_url, quantity = 1 }) {
    const cart = await this.getOrCreateCart(userId);
    const existing = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cart.id, product_id]);
    if (existing.rows.length > 0) {
      const updated = await pool.query(
        'UPDATE cart_items SET quantity = quantity + $1, updated_at = NOW() WHERE cart_id = $2 AND product_id = $3 RETURNING *',
        [quantity, cart.id, product_id]
      );
      return updated.rows[0];
    }
    const inserted = await pool.query(
      'INSERT INTO cart_items (cart_id, product_id, product_name, product_price, image_url, quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [cart.id, product_id, product_name, product_price, image_url, quantity]
    );
    return inserted.rows[0];
  }

  static async updateQuantity(userId, productId, quantity) {
    const cart = await this.getOrCreateCart(userId);
    if (quantity <= 0) {
      await pool.query('DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cart.id, productId]);
      return null;
    }
    const updated = await pool.query(
      'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE cart_id = $2 AND product_id = $3 RETURNING *',
      [quantity, cart.id, productId]
    );
    return updated.rows[0];
  }

  static async removeItem(userId, productId) {
    const cart = await this.getOrCreateCart(userId);
    await pool.query('DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cart.id, productId]);
  }

  static async clearCart(userId) {
    const cart = await this.getOrCreateCart(userId);
    await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cart.id]);
  }
}

module.exports = CartModel;
