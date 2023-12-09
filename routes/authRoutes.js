const express = require('express')
const router = express.Router()

const AuthController = require('../controllers/authController')

router.route('/login').post(AuthController.handleLogin)
router.route('/logout').post(AuthController.handleLogout)
module.exports = router
