const express = require('express');
require('dotenv').config();
const cors = require('cors');

const mongodb = require('./data/database');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const port = process.env.PORT || 8080;

app
  .use(express.json())
  .use('/', require('./routes'))
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use(
    cors({
      origin: ['https://cse-341-project1-mvvt.onrender.com', 'http://localhost:8080']
    })
  );

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and server is running on port ${port}`);
    });
  }
});
