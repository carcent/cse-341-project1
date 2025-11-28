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
    console.log('Using callback URL:', process.env.GITHUB_CALLBACK_URL);
    console.log('--- ENV CHECK ---');
    console.log('GITHUB_CLIENT_ID    =', process.env.GITHUB_CLIENT_ID);
    console.log('GITHUB_CALLBACK_URL =', process.env.GITHUB_CALLBACK_URL);
    console.log('------------------');
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
