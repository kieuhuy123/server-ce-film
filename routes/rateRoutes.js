const express = require('express')
const router = express.Router()

const RateController = require('../controllers/rateController')

router.post('/', RateController.rateMovie)
router.get('/:userId', RateController.getRatedMovie)

module.exports = router
