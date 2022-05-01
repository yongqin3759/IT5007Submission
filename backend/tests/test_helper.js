const Goal = require('../models/Goal')
const User = require('../models/user')


initialGoals = [
    {
      "name": "Do interview",
      "steps": [
        {
          "assignedPercentage": 60,
          "completedPercentage": 80,
          "goalId": "test",
          "name": "complete React",
          "percentage": 48
        },
        {
          "assignedPercentage": 20,
          "completedPercentage": 80,
          "goalId": "test",
          "name": "finish node",
          "percentage": 16
        }
      ]
    },
    {
      "name": "Code Smore",
      "steps": [
        {
          "assignedPercentage": 10,
          "completedPercentage": 50,
          "goalId": "test2",
          "name": "finish react",
          "percentage": 5
        },
        {
          "assignedPercentage": 10,
          "completedPercentage": 50,
          "goalId": "test2",
          "name": "finish node",
          "percentage": 5
        },
        {
          "assignedPercentage": 20,
          "completedPercentage": 50,
          "goalId": "test2",
          "name": "finish UI",
          "percentage": 10
        },
        {
          "assignedPercentage": 60,
          "completedPercentage": 0,
          "goalId": "test2",
          "name": null,
          "percentage": 0
        }
      ]
    }
]


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

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
}

const nonExistingId = async () => {
  const goal = new Goal({
    name: 'New Goal',
    steps: [
      {
        assignedPercentage: 20,
        completedPercentage: 50,
        name: '',
        percentage: 10,
      },
    ],
  })
  await goal.save()
  await goal.remove()

  console.log(goal._id.toString())
  return goal._id.toString()
}


const goalsInDb = async() => {
  const goals = await Goal.find({})
  return goals.map(goal => goal.toJSON())
}

module.exports = {
  initialGoals, nonExistingId, goalsInDb, usersInDb, newGoal
}