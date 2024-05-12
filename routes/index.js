'use strict'

const express = require('express')
const { apiKey, permission } = require('../middleware/checkAuth')
const router = express.Router()

// check apiKey
router.use(apiKey)
// check permission
router.use(permission('0000'))

router.use('/v1/api/watchlistMovie', require('./watchlist'))
router.use('/v1/api/ratingMovie', require('./rating'))
router.use('/v1/api/movie', require('./movie'))
router.use('/v1/api/comment', require('./comment'))
router.use('/v1/api/notification', require('./notification'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/package', require('./package'))
router.use('/v1/api/order', require('./order'))
router.use('/v1/api', require('./access'))

module.exports = router
