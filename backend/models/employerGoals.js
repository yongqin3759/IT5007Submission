const mongoose = require("mongoose");


const Goal = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},

})


module.exports = mongoose.model("goals", Goal);
