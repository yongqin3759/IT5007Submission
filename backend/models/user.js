const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    validate: /^[a-z ,.'-]+$/i
  },
  email: {
    required: true,
    validate: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    unique: true,
    type: String
  },
  passwordHash: {
    type: String,
    required: true,
  },
  goals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal'
    }
  ]
})


module.exports = mongoose.model('User', userSchema)