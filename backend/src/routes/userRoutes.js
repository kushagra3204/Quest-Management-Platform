const router = require('express').Router()
const fetchUserDetails = require("../controller/user/fetchUserDetailsController")

router.get('/user-details', fetchUserDetails);

module.exports = router;