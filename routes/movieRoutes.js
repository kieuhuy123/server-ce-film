const express = require('express')
const router = express.Router()

const movieController = require('../controllers/movieController')

router
  .route('/')
  .get(movieController.getAllMovies)
  .post(movieController.createNewMovie)

router
  .route('/:alias')
  .get(movieController.getMovie)
  .patch(movieController.updateMovie)
  .delete(movieController.deleteMovie)

module.exports = router
