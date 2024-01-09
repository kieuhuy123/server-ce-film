const express = require('express')
const router = express.Router()

const RateController = require('../controllers/rateController')
const { authenticationV2 } = require('../middleware/checkAuth')

// authentication
router.use(authenticationV2)

router.post('/', RateController.rateMovie)
router.patch('/', RateController.updateRatingMovie)
router.get('/:userId', RateController.getRatedMovie)

module.exports = router
