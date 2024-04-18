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
  findMovieByGenre,
  findMovieByKey,
  findFeaturedMovie
} = require('../models/repositories/movie.repo')
const { unGetSelectData } = require('../utils')

class MovieService {
  static getAllMovies = async ({ page = 1, limit = 12, sort = 'ctime' }) => {
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
    info,
    isFeatured,
    featuredImage
  }) => {
    // Confirm data
    if (
      !genre.length ||
      !type ||
      !alias ||
      !title ||
      !image ||
      !review ||
      !info
    ) {
      throw new BadRequestError('All fields are required')
    }

    const duplicate = await findMovieByAlias({ alias })
    if (duplicate) throw new ConflictRequestError('Alias movie already used!')

    const movie = await movieModel.create({
      title,
      alias,
      type,
      genre,
      image,
      trailer,
      review,
      video,
      info,
      is_featured: isFeatured,
      featured_image: featuredImage
    })

    if (!movie) throw new BadRequestError('create new Movie error')

    return movie
  }

  static updateMovie = async (
    { movieId },
    {
      title,
      type,
      alias,
      genre,
      image,
      trailer,
      review,
      video,
      info,
      is_featured,
      featured_image
    }
  ) => {
    const bodyUpdate = {
      title,
      type,
      alias,
      genre,
      image,
      trailer,
      review,
      video,
      info,
      is_featured,
      featured_image
    }

    // Confirm data
    if (!genre.length || !type || !alias || !image || !review || !info) {
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

  static getMovieByType = async (
    { type },
    { page = 1, limit = 12, sort = 'ctime' }
  ) => {
    if (!type) throw new BadRequestError('type movie is required')

    const select = unGetSelectData(['info', '__v', 'genre', 'review'])
    const filter = { type }
    const total = await movieModel.find(filter).count()
    const movies = await findAllMovies({
      filter,
      limit,
      sort,
      page,
      select
    })

    if (!movies) throw new BadRequestError('get movies error')

    return {
      movies: movies,
      currentPage: Number(page),
      totalMovies: total,
      numberOfPages: Math.ceil(total / limit)
    }
  }

  static getMovieByGenre = async (
    { genre },
    { page = 1, limit = 12, sort = 'ctime' }
  ) => {
    if (!genre) throw new BadRequestError('genre movie is required')

    const select = unGetSelectData(['info', '__v', 'genre', 'review'])
    const filter = { genre }
    const total = await movieModel.find(filter).count()
    const movies = await findAllMovies({ filter, limit, sort, page, select })

    if (!movies) throw new BadRequestError('get movies error')

    return {
      movies: movies,
      currentPage: Number(page),
      totalMovies: total,
      numberOfPages: Math.ceil(total / limit)
    }
  }

  static getMovieByKey = async ({ keyword, limit = 12 }) => {
    const select = unGetSelectData(['info', '__v', 'genre'])

    const movies = await findMovieByKey({ keyword, limit, select })
    if (!movies) throw new BadRequestError('get movies error')

    return movies
  }

  static getFeaturedMovie = async () => {
    const movies = await findFeaturedMovie()
    if (!movies) throw new BadRequestError('get featured movies error')

    return movies
  }
}

module.exports = MovieService
