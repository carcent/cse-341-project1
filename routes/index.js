const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

// Auth Routes
router.use('/auth', require('./auth'));

// API routes
router.use('/contacts', require('./contacts'));
router.use('/products', require('./products'));

module.exports = router;
