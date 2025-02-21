const router = require('express').Router()
const signup = require('../controller/auth/signupController')
const login = require('../controller/auth/loginController')
const user = require('../controller/auth/userController')
const logout = require('../controller/auth/logoutController')

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', user);

module.exports = router;