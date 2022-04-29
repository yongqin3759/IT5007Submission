const router = require('express').Router();
const auth = require('../controllers/auth');




router.post('/signup', auth.createUser)
router.post('/signin', auth.signIn)



module.exports = router;