'use strict'

const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../middleware/checkAuth')

// register
router.post('/user/register', asyncHandler(accessController.register))
// login
router.post('/user/login', asyncHandler(accessController.login))

// authentication
router.use(authentication)
// logout
router.post('/user/logout', asyncHandler(accessController.logout))

module.exports = router
