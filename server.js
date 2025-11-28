const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;

// --------------------
// MIDDLEWARES
// --------------------
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

app.use(bodyParser.json());

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({ origin: 'http://localhost:8080', credentials: true }));

app.use('/', require('./routes'));

// --------------------
// PASSPORT GITHUB STRATEGY
// --------------------
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL // e.g., https://cse-341-project1-mvvt.onrender.com/github/callback
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// --------------------
// ROUTES
// --------------------

// Home route
app.get('/', (req, res) => {
  res.send(req.session.user ? `Logged in as ${req.session.user.username}` : 'Logged Out');
});

// GitHub login route
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback route
app.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

// --------------------
// ERROR HANDLER
// --------------------
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// --------------------
// START SERVER
// --------------------
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database initialized and server running on port ${port}`);
    });
  }
});
