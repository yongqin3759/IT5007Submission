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

describe('deleting a Goal', () => {
  let accessToken 
  let goalId
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('root', 10)
    const user = new User({email: 'root@root.com', fullName:'root', passwordHash })

    await user.save()
    let response = await api.post('/api/auth/signin').send({email:"root@root.com", password:"root"})

    accessToken = response.body.token

    const newGoal = {
      name: 'New Goal',
      steps: [
        {
          assignedPercentage: 20,
          completedPercentage: 50,
          name: '',
          percentage: 10,
        },
      ],
    };
    let goalRes = await api
                          .post('/api/goals')
                          .set('Authorization', `bearer ${accessToken}`)
                          .send(newGoal)
    goalId = goalRes.body._id
  })

  test('deleting a valid goal', async () => {
    let startGoals = await helper.goalsInDb()

    await api.delete(`/api/goals/${goalId}`)
              .set('Authorization', `bearer ${accessToken}`)
              .expect(202)
    
    let endGoals = await helper.goalsInDb()

    expect(endGoals).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({_id: goalId})
      ])
    )

    expect(endGoals).toHaveLength(startGoals.length -1)

  })

  test('deleting a invalid goal', async () => {
    let deletedGoalId = await helper.nonExistingId()

    const goalsAtStart = await helper.goalsInDb()
    let res = await api
              .delete(`/api/goals/${deletedGoalId}`)
              .set('Authorization', `bearer ${accessToken}`)
              .expect(202)

    expect(res.body.error).toEqual('Goal does not exist')
    const goalsAtEnd = await helper.goalsInDb()
    expect(goalsAtEnd).toHaveLength(goalsAtStart.length)
  })
})

describe('Creating a Goal', () => {
  let accessToken 
  let userId
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('root', 10)
    const user = new User({email: 'root@root.com', fullName:'root', passwordHash })

    let userRes = await user.save()
    userId = userRes._id.toString()

    let response = await api.post('/api/auth/signin').send({email:"root@root.com", password:"root"})

    accessToken = response.body.token
  })

  test('creating a goal with an access token', async () => {
    let startGoals = await helper.goalsInDb()

    let newGoal = helper.newGoal

    let res = await api.post(`/api/goals/`)
                .set('Authorization', `bearer ${accessToken}`)
                .send(newGoal)
                .expect(201)
    
    let endGoals = await helper.goalsInDb()

    expect(endGoals).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({_id: res.body._id})
      ])
    )

    expect(endGoals).toHaveLength(startGoals.length +1)

  })

  test('post without token is unauthorised', async () => {
    let newGoal = helper.newGoal
    const goalsAtStart = await helper.goalsInDb()

    await api
            .post('/api/goals')
            .send(newGoal)
            .expect(401)
            .expect('Content-Type', /application\/json/)
  
    const goalsAtEnd = await helper.goalsInDb()
    expect(goalsAtEnd).toHaveLength(goalsAtStart.length)
  })
})


describe('updating a goal', () => {
  let accessToken 
  let goalId
  let userId
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('root', 10)
    const user = new User({email: 'root@root.com', fullName:'root', passwordHash })

    let userRes = await user.save()
    userId = userRes._id.toString()

    let response = await api.post('/api/auth/signin').send({email:"root@root.com", password:"root"})

    accessToken = response.body.token
    let newGoal = helper.newGoal

    let goalRes = await api.post(`/api/goals/`)
                .set('Authorization', `bearer ${accessToken}`)
                .send(newGoal)
                .expect(201)
    
    goalId = goalRes.body._id
  })
  
  test('updating a single goal', async () => {
    const updatedGoal = await api
                                .get(`/api/goals/${goalId}`)
                                .set('Authorization', `bearer ${accessToken}`)
                                .expect(200)
    const {name,steps, _id} = updatedGoal.body
    updatedGoal.name = 'code more'
    
    await api
            .put(`/api/goals/${goalId}`)
            .set('Authorization', `bearer ${accessToken}`)
            .send({name:'code smore'})
            .expect(202)
            .expect('Content-Type', /application\/json/)
    
    const goalsAtEnd = await helper.goalsInDb()
    expect(goalsAtEnd).toEqual(
      expect.arrayContaining([
        expect.objectContaining({_id: new mongoose.Types.ObjectId(goalId)}),
        expect.objectContaining({name: 'code smore'}),
        expect.objectContaining({user: new mongoose.Types.ObjectId(userId)})
      ])
    )
  })
})

afterAll(()=>{
  mongoose.connection.close()
})