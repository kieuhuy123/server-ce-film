'use strict'

const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../middleware/checkAuth')
const {
  createPaymentIntents
} = require('../../controllers/checkout.controller')

router.route('/payment-intents').post(asyncHandler(createPaymentIntents))

module.exports = router
