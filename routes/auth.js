const express = require('express');
const router = express.Router();
const passport = require('passport');

// login  GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback  GitHub
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    res.json({
      message: 'Logged in successfully',
      user: req.user
    });
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
