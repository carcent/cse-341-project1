// routes/index.js
const express = require('express');
const router = express.Router();

// Home
router.get('/', (req, res) => {
  res.send('API is running...');
});

// Auth Routes
router.use('/auth', require('./auth'));

// API Routes
router.use('/contacts', require('./contacts'));
router.use('/products', require('./products'));

module.exports = router;
