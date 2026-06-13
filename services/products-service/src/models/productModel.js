const pool = require('../config/db');

class ProductModel {
  // Create a new product
  static async create({ name, description, price, stock, image_url, category_id }) {
    const query = `
      INSERT INTO products (name, description, price, stock, image_url, category_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [name, description, price, stock || 0, image_url, category_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // Get product by id
  static async findById(id) {
    const query = `
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  // List products with optional search, category filter, pagination
  static async findAll({ limit = 20, offset = 0, search, category_id }) {
    let query = `
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const values = [];
    let idx = 1;

    if (search) {
      query += ` AND p.name ILIKE $${idx}`;
      values.push(`%${search}%`);
      idx++;
    }

    if (category_id) {
      query += ` AND p.category_id = $${idx}`;
      values.push(category_id);
      idx++;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
    values.push(limit, offset);

    const { rows } = await pool.query(query, values);
    return rows;
  }

  // Count total products (for pagination)
  static async countAll({ search, category_id }) {
    let query = `SELECT COUNT(*) FROM products WHERE 1=1`;
    const values = [];
    let idx = 1;

    if (search) {
      query += ` AND name ILIKE $${idx}`;
      values.push(`%${search}%`);
      idx++;
    }

    if (category_id) {
      query += ` AND category_id = $${idx}`;
      values.push(category_id);
      idx++;
    }

    const { rows } = await pool.query(query, values);
    return parseInt(rows[0].count, 10);
  }

  // Update product
  static async update(id, { name, description, price, stock, image_url, category_id }) {
    const query = `
      UPDATE products
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          stock = COALESCE($4, stock),
          image_url = COALESCE($5, image_url),
          category_id = COALESCE($6, category_id),
          updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `;
    const values = [name, description, price, stock, image_url, category_id, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // Delete product
  static async delete(id) {
    const { rows } = await pool.query(`DELETE FROM products WHERE id = $1 RETURNING id`, [id]);
    return rows[0];
  }

  // Reduce stock (used by orders-service via internal call later)
  static async reduceStock(id, quantity) {
    const query = `
      UPDATE products
      SET stock = stock - $1, updated_at = NOW()
      WHERE id = $2 AND stock >= $1
      RETURNING *
    `;
    const { rows } = await pool.query(query, [quantity, id]);
    return rows[0]; // undefined if not enough stock
  }
}

module.exports = ProductModel;