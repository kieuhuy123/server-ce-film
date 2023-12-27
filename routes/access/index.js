'use strict'

const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controller')

// register
router.post('/user/register', accessController.register)

module.exports = router
