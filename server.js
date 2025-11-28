const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongodb = require('./data/database');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const port = process.env.PORT || 8080;
const errorHandler = require('./middleware/errorHandler');
const passport = require('passport');
const session = require('express-session');
const gitHubStrategy = require('passport-github2').Strategy;
const bodyParser = require('body-parser');

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

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  // res.setHeader(
  //     'Access-Control-Allow-Headers',
  //     'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  // );
  // res.setHeader(
  //     'Access-Control-Allow-Methods',
  //     'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
  })
);

app.use('/', require('./routes'));

passport.use(
  new gitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/', (req, res) => {
  res.send(req.session.user ? `Logged in as ${req.session.user.username}` : 'Logged Out');
});

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

app.use(errorHandler);

// --------------------
// START SERVER
// --------------------

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and server is running on port ${port}`);
    });
  }
});
