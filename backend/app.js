const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const middleware = require('./utils/middleware')
const loggers = require('./utils/middleware');


app.use(express.json(), express.urlencoded({ extended: true }), cors());
app.use(express.static('build'))
app.use(middleware.requestLogger)

app.use('/api/auth', require('./routes/auth'));
app.use('/api/goals', require('./routes/goals'));


app.use(loggers.errorHandler)
const PORT = process.env.PORT || 3003;

mongoose.connect(process.env.TEST_MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`Server is running on ${PORT}`)))