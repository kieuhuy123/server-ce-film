const express = require('express')
const router = express.Router()

const watchlistController = require('../controllers/watchlistController')

router
  .route('/')
  .post(watchlistController.addToWatchlist)
  .delete(watchlistController.removeFromWatchlist)

router.get('/:user_email', watchlistController.getWatchlists)

module.exports = router
