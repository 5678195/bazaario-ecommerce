const pool = require('../config/db');

class CategoryModel {
  static async create({ name }) {
    const query = `
      INSERT INTO categories (name)
      VALUES ($1)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [name]);
    return rows[0];
  }

  static async findAll() {
    const { rows } = await pool.query(`SELECT * FROM categories ORDER BY name ASC`);
    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query(`SELECT * FROM categories WHERE id = $1`, [id]);
    return rows[0];
  }

  static async delete(id) {
    const { rows } = await pool.query(`DELETE FROM categories WHERE id = $1 RETURNING id`, [id]);
    return rows[0];
  }
}

module.exports = CategoryModel;