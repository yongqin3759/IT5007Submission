const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = async (request, response, next) => {
  try {
    const authorization = request.get('Authorization');
    if (!authorization) {
      const error = new Error('User is not authenticated!');
      error.status = 401;
      throw error
    }
    const token = authorization.split(' ')[1];
    const user = jwt.verify(token, process.env.SECRET)
    request.user = user;
    next();
  }
  catch (err) {
    next(err)
  }
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  request.user = user
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'MongoServerError' && error.code === 11000) error.status = 422;
  response.status(+error.status || +error.statusCode || +error.code || 500).send(error);
  next(error)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}