const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const middleware = require('./utils/middleware')
const logger = require('./utils/logger');
const config = require('./utils/configs')


app.use(express.json(), express.urlencoded({ extended: true }), cors());
app.use(express.static('build'))
app.use(middleware.requestLogger)

app.use('/api/auth', require('./routes/auth'));
app.use('/api/goals', require('./routes/goals'));


app.use(middleware.errorHandler)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

module.exports = app