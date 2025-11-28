// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');

// -------------------------------------
// LOGIN - GitHub
// -------------------------------------
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// -------------------------------------
// CALLBACK - GitHub OAuth
// -------------------------------------
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    res.json({
      message: 'Logged in successfully',
      user: {
        id: req.user.id,
        username: req.user.username,
        displayName: req.user.displayName
      }
    });
  }
);

// -------------------------------------
// LOGOUT
// -------------------------------------
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
