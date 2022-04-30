const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const helper = require('./test_helper')

const app = require('../app')

const api = supertest(app)
const Goal = require('../models/Goal')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ email: 'root@root.com', fullName:'root', passwordHash })

  const savedUser = await user.save()
  
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ email: 'root@root.com', fullName:'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      fullName: 'derp',
      email: 'derp@derp.com',
      password: 'derp',
    }

    await api
      .post('/api/auth/signup')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if email already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = { email: 'root@root.com', fullName:'root', password:'hello' }

    const result = await api
      .post('/api/auth/signup')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Email already exists!')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if email is not valid', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      email: 'root', fullName:'root', password:'hello' 
    }

    const result = await api
      .post('/api/auth/signup')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Email not valid!')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password less than 3 char', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      email: 'root@root.com', fullName:'root', password:'d'
    }

    const result = await api
      .post('/api/auth/signup')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Password length cannot be less than 3!')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})


afterAll(()=>{
  mongoose.connection.close()
})