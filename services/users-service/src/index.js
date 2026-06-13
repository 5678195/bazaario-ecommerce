const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check - used by Kubernetes liveness/readiness probes
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok', service: 'users-service', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', service: 'users-service', db: 'disconnected' });
  }
});

// API routes
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Users service running on port ${PORT}`);
});

module.exports = app;