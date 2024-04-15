'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const watchlistController = require('../../controllers/watchlist.controller')
const { authenticationV2 } = require('../../middleware/checkAuth')
const router = express.Router()

router.use(authenticationV2)
router
  .route('/')
  .get(asyncHandler(watchlistController.getWatchlist))
  .post(asyncHandler(watchlistController.addToWatchlist))
  .delete(asyncHandler(watchlistController.removeFromWatchlist))

module.exports = router
