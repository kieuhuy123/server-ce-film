'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const NotificationController = require('../../controllers/notification.controller')
const router = express.Router()
// Here not login

// Login
router.get('', asyncHandler(NotificationController.listNotiByUser))
module.exports = router
