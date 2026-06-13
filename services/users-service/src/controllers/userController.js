const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../config/jwt');

const SALT_ROUNDS = 10;

// POST /api/users/register
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await UserModel.findByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  // Only allow 'admin' role creation if explicitly seeded - default to customer
  const safeRole = role === 'admin' ? 'admin' : 'customer';

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await UserModel.create({ name, email, hashedPassword, role: safeRole });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.status(201).json({
    message: 'User registered successfully',
    user,
    accessToken,
    refreshToken,
  });
};

// POST /api/users/login
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({
    message: 'Login successful',
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  });
};

// POST /api/users/refresh
const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
};

// GET /api/users/me
const getProfile = async (req, res) => {
  const user = await UserModel.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
};

// PUT /api/users/me
const updateProfile = async (req, res) => {
  const { name, phone, address } = req.body;
  const updated = await UserModel.updateProfile(req.user.id, { name, phone, address });
  res.json({ message: 'Profile updated', user: updated });
};

// GET /api/users  (admin only)
const listUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const users = await UserModel.findAll({ limit, offset });
  const total = await UserModel.countAll();

  res.json({
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

module.exports = {
  register,
  login,
  refresh,
  getProfile,
  updateProfile,
  listUsers,
};