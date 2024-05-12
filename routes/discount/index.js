'use strict'

const express = require('express')
const router = express.Router()
const DiscountController = require('../../controllers/discount.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../middleware/checkAuth')

// router.use(authenticationV2)
router
  .route('/')
  .post(asyncHandler(DiscountController.createDiscountCode))
  .get(asyncHandler(DiscountController.getListDiscount))

module.exports = router
