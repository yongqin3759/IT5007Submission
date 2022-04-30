const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateError = require("../utils/generateError");

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

exports.createUser = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body

        if (!password || password.length < 3) {
            return res.status(400).json({ error: 'Password length cannot be less than 3!'})
        }
        if(!validateEmail(email)){
            return res.status(400).json({ error: 'Email not valid!'})
        }
        const userExists = await User.findOne({email})
        if(userExists){
            return res.status(400).json({ error: 'Email already exists!'})
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