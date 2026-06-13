const pool = require('../config/db');

class UserModel {
  // Create a new user, returns the created row (without password)
  static async create({ name, email, hashedPassword, role = 'customer' }) {
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at
    `;
    const values = [name, email, hashedPassword, role];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // Find user by email (includes password hash - for login)
  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  // Find user by id (excludes password)
  static async findById(id) {
    const query = `
      SELECT id, name, email, role, phone, address, created_at, updated_at
      FROM users WHERE id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  // Update profile fields
  static async updateProfile(id, { name, phone, address }) {
    const query = `
      UPDATE users
      SET name = COALESCE($1, name),
          phone = COALESCE($2, phone),
          address = COALESCE($3, address),
          updated_at = NOW()
      WHERE id = $4
      RETURNING id, name, email, role, phone, address, updated_at
    `;
    const { rows } = await pool.query(query, [name, phone, address, id]);
    return rows[0];
  }

  // List all users (admin only) - paginated
  static async findAll({ limit = 20, offset = 0 }) {
    const query = `
      SELECT id, name, email, role, phone, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const { rows } = await pool.query(query, [limit, offset]);
    return rows;
  }

  static async countAll() {
    const { rows } = await pool.query(`SELECT COUNT(*) FROM users`);
    return parseInt(rows[0].count, 10);
  }
}

module.exports = UserModel;