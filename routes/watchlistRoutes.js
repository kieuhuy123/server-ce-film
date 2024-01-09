const express = require('express')
const router = express.Router()

const watchlistController = require('../controllers/watchlistController')
const { authenticationV2 } = require('../middleware/checkAuth')

// authentication
router.use(authenticationV2)
router
  .route('/')
  .get(watchlistController.getWatchlists)
  .post(watchlistController.addToWatchlist)
  .delete(watchlistController.removeFromWatchlist)

// router.get('/:user_email', watchlistController.getWatchlists)

module.exports = router
