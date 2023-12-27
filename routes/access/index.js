'use strict'

const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../middleware/asyncHandler')

// register
router.post('/user/register', asyncHandler(accessController.register))

module.exports = router
