const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateError = require("../utils/generateError");

exports.createUser = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body

        if (!password || password.length < 3) {
            const error = new Error('Password length cannot be less than 3!');
            error.status = 400;
            throw error;
        }
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            fullName,
            email,
            passwordHash,
        })

        const savedUser = await user.save()

        const token = jwt.sign({ _id: savedUser._id, fullName, email, date: new Date() }, process.env.SECRET, { expiresIn: '1h' })

        res.status(201).json({ fullName, email, token })
    }
    catch (err) {
        next(err)
    }
}

exports.signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email) generateError(400, 'Email is required')
        const user = await User.findOne({ email });
        if (!user) generateError(404, 'User not found!');
        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordCorrect) generateError(404, 'Password is incorrect!');

        const resData = { fullName: user.fullName, email: user.email, _id: user._id };

        const token = jwt.sign({ ...resData, date: new Date() }, process.env.SECRET, { expiresIn: '1h' })
        res.status(200).json({ ...resData, token })
    }
    catch (err) {
        next(err)
    }
}