const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4002;

// Middleware
app.use(cors());
app.use(express.json());

// Health check - used by Kubernetes liveness/readiness probes
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok', service: 'products-service', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', service: 'products-service', db: 'disconnected' });
  }
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/uploads', uploadRoutes);

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Products service running on port ${PORT}`);
});

module.exports = app;