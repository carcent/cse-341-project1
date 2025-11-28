// routes/index.js
const passport = require('passport');
const express = require('express');
const router = express.Router();

// Home
router.use('/', require('./swagger'));

// API Routes
router.use('/contacts', require('./contacts'));
router.use('/products', require('./products'));

router.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.session.user = null;

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

module.exports = router;
