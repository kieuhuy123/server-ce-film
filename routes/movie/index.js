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
router.route('/type/:type').get(asyncHandler(movieController.getMovieByType))

router
  .route('/:movieId')
  .patch(asyncHandler(movieController.updateMovie))
  .delete(asyncHandler(movieController.deleteMovie))

router.post('/related', asyncHandler(movieController.getRelatedMovie))

module.exports = router
