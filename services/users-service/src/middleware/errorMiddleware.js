// Catches errors thrown in async route handlers
function asyncHandler(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

// Global error handler - last middleware in the chain
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Postgres unique violation (duplicate email etc.)
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
  });
}

module.exports = { asyncHandler, errorHandler };