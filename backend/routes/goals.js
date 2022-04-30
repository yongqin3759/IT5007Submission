const router = require('express').Router();
const middleware = require('../utils/middleware');
const Goal = require('../models/Goal');


router.post('/', middleware.tokenExtractor, async (req, res, next) => {
    try {
        const goal = await Goal.create({ ...req.body, user: req.user._id });
        res.status(201).json(goal);
    }
    catch (err) {
        next(err)
    }
})

router.get('/', middleware.tokenExtractor, async (req, res, next) => {
    try {
        const goals = await Goal.find({ user: req.user._id });
        // goal._doc.user = req.user;
        res.status(201).json(goals);
    }
    catch (err) {
        next(err)
    }
})


router.put('/:goalId', middleware.tokenExtractor, async (req, res, next) => {
    try {
        const re = await Goal.updateOne({ _id: req.params.goalId, user: req.user._id }, { $set: req.body })
        res.status(202).json(re);
    }
    catch (err) {
        next(err)
    }
})

router.delete('/:goalId', middleware.tokenExtractor, async (req, res, next) => {
    try {
        const re = await Goal.findOneAndDelete({ _id: req.params.goalId, user: req.user._id }, { $set: req.body })
        res.status(202).json(re);
    }
    catch (err) {
        next(err)
    }
})


module.exports = router;