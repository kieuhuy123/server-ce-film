'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const watchlistController = require('../../controllers/watchlist.controller')
const router = express.Router()

router
  .route('/')
  .get(asyncHandler(watchlistController.getWatchlist))
  .post(asyncHandler(watchlistController.addToWatchlist))
  .delete(asyncHandler(watchlistController.removeFromWatchlist))

module.exports = router
