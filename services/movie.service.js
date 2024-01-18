'use strict'

const {
  BadRequestError,
  ConflictRequestError
} = require('../core/error.response')
const movieModel = require('../models/movie.model')
const {
  findAllMovies,
  findMovieByAlias,
  updateMovieById,
  findMovieByGenre
} = require('../models/repositories/movie.repo')
const { unGetSelectData } = require('../utils')

class MovieService {
  static getAllMovies = async ({ page = 1, limit = 6, sort = 'ctime' }) => {
    const select = unGetSelectData(['info', '__v', 'genre', 'review'])

    const total = await movieModel.countDocuments({})

    const movies = await findAllMovies({ limit, sort, page, select })
    if (!movies) throw new BadRequestError('get movies error')
    return {
      movies: movies,
      currentPage: Number(page),
      totalMovies: total,
      numberOfPages: Math.ceil(total / limit)
    }
  }

  static getMovieByAlias = async ({ alias }) => {
    const unSelect = ['__v']
    const movie = await findMovieByAlias({ alias, unSelect })
    if (!movie) throw new BadRequestError('get movie error')

    return movie
  }

  static createMovie = async ({
    title,
    type,
    alias,
    genre,
    image,
    trailer,
    review,
    video,
    info
  }) => {
    // Confirm data
    if (
      !genre ||
      !type ||
      !alias ||
      !title ||
      !image ||
      !trailer ||
      !review ||
      !video ||
      !info
    ) {
      throw new BadRequestError('All fields are required')
    }

    const duplicate = await findMovieByAlias({ alias })
    if (duplicate) throw new ConflictRequestError('Alias movie already used!')

    const movie = await movieModel.create({
      title,
      alias,
      image,
      trailer,
      review,
      video,
      info
    })

    if (!movie) throw new BadRequestError('create new Movie error')

    return movie
  }

  static updateMovie = async ({ movieId }, bodyUpdate) => {
    const { title, type, genre, image, trailer, alias, review, video, info } =
      bodyUpdate

    // Confirm data
    if (
      !genre.length ||
      !type ||
      !alias ||
      !image ||
      !trailer ||
      !review ||
      !video ||
      !info
    ) {
      throw new BadRequestError('All fields are required')
    }

    if (!movieId) throw new BadRequestError('movieId is required')

    const updateMovie = await updateMovieById({ movieId, bodyUpdate })

    if (!updateMovie) throw new BadRequestError(`update Movie ${title} error`)
    return updateMovie
  }

  static deleteMovie = async ({ movieId }) => {
    if (!movieId) throw new BadRequestError('movieId is required')

    const movieDelete = await movieModel.findByIdAndDelete(movieId)
    if (!movieDelete) throw new BadRequestError('Delete Movie error')

    return movieDelete
  }

  static getRelatedMovies = async ({ movieId, genre }) => {
    if (!movieId || !genre)
      throw new BadRequestError('movieId and genre are required!')

    const movie = await findMovieByGenre({ movieId, genre })
    if (!movie) throw new BadRequestError('Get movie related error')
    return movie
  }

  static getMovieByType = async ({
    type,
    page = 1,
    limit = 6,
    sort = 'ctime'
  }) => {
    if (!type) throw new BadRequestError('type movie is required')

    const select = unGetSelectData(['info', '__v', 'genre', 'review'])
    const total = await movieModel.countDocuments({})
    const filter = { type }
    const movies = await findAllMovies({ filter, limit, sort, page, select })

    if (!movies) throw new BadRequestError('get movies error')

    return {
      movies: movies,
      currentPage: Number(page),
      totalMovies: total,
      numberOfPages: Math.ceil(total / limit)
    }
  }

  static getMovieByGenre = async ({
    genre,
    page = 1,
    limit = 6,
    sort = 'ctime'
  }) => {
    if (!genre) throw new BadRequestError('genre movie is required')

    const select = unGetSelectData(['info', '__v', 'genre', 'review'])
    const total = await movieModel.countDocuments({})
    const filter = { genre }
    const movies = await findAllMovies({ filter, limit, sort, page, select })

    if (!movies) throw new BadRequestError('get movies error')

    return {
      movies: movies,
      currentPage: Number(page),
      totalMovies: total,
      numberOfPages: Math.ceil(total / limit)
    }
  }
}

module.exports = MovieService
