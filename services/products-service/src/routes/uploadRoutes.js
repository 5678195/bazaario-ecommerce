const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// POST /api/uploads  (admin only) - returns the uploaded file URL
router.post('/', authenticate, authorize('admin'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({ message: 'File uploaded successfully', url: fileUrl });
});

module.exports = router;