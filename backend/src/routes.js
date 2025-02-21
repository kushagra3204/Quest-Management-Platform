const authRoutes = require('./routes/authRoutes')
const questRoutes = require('./routes/questRoutes')
const userRoutes = require('./routes/userRoutes')
const router = require("express").Router()

router.use('/api/auth/',authRoutes)
router.use('/api/quests/',questRoutes)
router.use('/api/user/',userRoutes)

module.exports = router