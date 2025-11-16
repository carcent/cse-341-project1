const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

router.use('/contacts', require('./contacts'));

router.use('/products', require('./products'));

module.exports = router;
