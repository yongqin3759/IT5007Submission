const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  let users = await User.find({}).populate('blogs')

  response.status(200).json(users)
})

usersRouter.get('/:id', async (request, response) => {
  let user = await User.findById(request.params.id).populate('blogs')
  response.status(200).json(user)
})

usersRouter.post('/', async (request, response) => {
  const { fullName, email, password } = request.body

  let error = {}

  let existingUser = await User.findOne({ email })

  if (existingUser) {
    error.existingUser = 'Email already exists!'
  }
  if (password.length < 3) {
    error.password = 'Password length cannot be less than 3!'
  } 
  if(!/^[a-z ,.'-]+$/i.test(fullName)){
    error.fullName = 'This is not a name!'
  }

  if (Object.keys(error).length !== 0) {
    return response.status(400).json({ error })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    fullName,
    email,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter