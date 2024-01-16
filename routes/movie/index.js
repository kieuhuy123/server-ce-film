'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const movieController = require('../../controllers/movie.controller')
const router = express.Router()

router
  .route('/')
  .get(asyncHandler(movieController.getAllMovies))
  .post(asyncHandler(movieController.createMovie))

router.route('/:alias').get(asyncHandler(movieController.getMovieByAlias))

router.patch('/:movieId', asyncHandler(movieController.updateMovie))

module.exports = router
