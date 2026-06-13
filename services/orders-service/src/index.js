const express = require('express');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4004;

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok', service: 'orders-service', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', service: 'orders-service', db: 'disconnected' });
  }
});

app.use('/api/orders', orderRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Orders service running on port ${PORT}`);
});

module.exports = app;
