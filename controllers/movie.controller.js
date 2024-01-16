'use strict'

const { Created, Ok } = require('../core/success.response')

const MovieService = require('../services/movie.service')

class MovieController {
  getAllMovies = async (req, res, next) => {
    new Ok({
      message: 'Get list movies OK',
      metadata: await MovieService.getAllMovies(req.query)
    }).send(res)
  }

  getMovieByAlias = async (req, res, next) => {
    new Ok({
      message: 'Get movie OK',
      metadata: await MovieService.getMovieByAlias(req.params)
    }).send(res)
  }

  createMovie = async (req, res, next) => {
    new Ok({
      message: 'Create movies OK',
      metadata: await MovieService.createMovie(req.body)
    }).send(res)
  }

  updateMovie = async (req, res, next) => {
    new Ok({
      message: 'Update movies OK',
      metadata: await MovieService.updateMovie({ ...req.params }, req.body)
    }).send(res)
  }

  deleteMovie = async (req, res, next) => {
    new Ok({
      message: 'Delete movies OK',
      metadata: await MovieService.deleteMovie(req.params)
    }).send(res)
  }

  getRelatedMovie = async (req, res, next) => {
    new Ok({
      message: 'Get related movies OK',
      metadata: await MovieService.getRelatedMovies(req.body)
    }).send(res)
  }
}

module.exports = new MovieController()
