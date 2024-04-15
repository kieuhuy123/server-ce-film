'use strict'

const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../middleware/checkAuth')

// register
router.post('/user/register', asyncHandler(accessController.register))
// login
router.post('/user/login', asyncHandler(accessController.login))
// login with google
router.post('/user/googleLogin', asyncHandler(accessController.googleLogin))
// authentication
router.use(authenticationV2)
// logout
router.post('/user/logout', asyncHandler(accessController.logout))
// refreshToken
router.post(
  '/user/refreshToken',
  asyncHandler(accessController.handleRefreshToken)
)
module.exports = router
