'use strict'

const express = require('express')
const { apiKey, permission } = require('../middleware/checkAuth')
const router = express.Router()

// check apiKey
router.use(apiKey)
// check permission
router.use(permission('0000'))

router.use('/v1/api/rateMovie', require('./rating'))
router.use('/v1/api/movie', require('./movie'))
router.use('/v1/api/comment', require('./comment'))
router.use('/v1/api', require('./access'))

module.exports = router
