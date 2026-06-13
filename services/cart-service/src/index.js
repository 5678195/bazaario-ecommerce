const express = require('express');
const cors = require('cors');
require('dotenv').config();

const cartRoutes = require('./routes/cartRoutes');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4003;

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok', service: 'cart-service', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', service: 'cart-service', db: 'disconnected' });
  }
});

app.use('/api/cart', cartRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Cart service running on port ${PORT}`);
});

module.exports = app;
