const express = require('express');
const cors = require('cors');

const util = require('util');



const app = require('./app') // the actual Express application
const http = require('http')
const config = require('./utils/configs')
const logger = require('./utils/logger')

const server = http.createServer(app)

const middleware = require('./utils/middleware')

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})