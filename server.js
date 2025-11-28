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

// --------------------
// MIDDLEWARES
// --------------------

app.use(
  cors({
    origin: ['https://cse-341-project1-mvvt.onrender.com', 'http://localhost:8080']
  })
);

app.use(express.json());

// CORS extra
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT');
  next();
});

// --------------------
// SESSION + PASSPORT
// --------------------

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

// --------------------
// PASSPORT STRATEGY
// --------------------

passport.use(
  new gitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// --------------------
// ROUTES
// --------------------

app.use('/', require('./routes'));

// --------------------
// SWAGGER
// --------------------
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    oauth2RedirectUrl: 'https://cse-341-project1-mvvt.onrender.com/api-docs/oauth2-redirect.html'
  })
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
