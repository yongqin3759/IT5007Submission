const mongoose = require("mongoose");

const StepSchema = new mongoose.Schema({
    assignedPercentage: {
        type: Number
    },
    completedPercentage: {
        type: Number
    },
    name: {
        type: String
    }
})

const GoalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    steps: {
        type: [StepSchema],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})



module.exports = mongoose.model("Goals", GoalSchema);
