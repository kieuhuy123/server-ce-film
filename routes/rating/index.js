'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const ratingController = require('../../controllers/rating.controller')
const router = express.Router()

router
  .route('/')
  .get(asyncHandler(ratingController.getListRating))
  .post(asyncHandler(ratingController.addRating))
  .patch(asyncHandler(ratingController.updateRating))

module.exports = router
