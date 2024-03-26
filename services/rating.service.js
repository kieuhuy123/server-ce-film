'use strict'

const Rating = require('../models/rating.model')
const Movie = require('../models/movie.model')
const { BadRequestError } = require('../core/error.response')
const { unGetSelectData } = require('../utils')
const { getMovieById } = require('../models/repositories/movie.repo')

class RatingService {
  // static createUserRating = async ({ userId, movie, ratingValue }) => {
  //   const query = {
  //     rating_user_id: userId
  //     // 'rating_list.movie_id': { $ne: movie._id }
  //   }
  //   const updateOrInsert = {
  //     $addToSet: {
  //       rating_list: {
  //         movie_id: movie._id,
  //         title: movie.title,
  //         alias: movie.alias,
  //         image: movie.image,
  //         total_rating_value: movie.total_rating_value,
  //         rating_count: movie.rating_count,
  //         rating_value: ratingValue
  //       }
  //     }
  //   }

  //   const option = {
  //     upsert: true,
  //     new: true
  //   }

  //   return await Rating.findOneAndUpdate(query, updateOrInsert, option)
  // }

  static addRating = async ({ userId, movieId, ratingValue }) => {
    // check the movie exists
    const unSelect = ['__v', 'info', 'review', 'trailer', 'video']
    // throw new BadRequestError('Add rating error')
    const movie = await getMovieById({ movieId, unSelect })

    if (!movie) throw new NotFoundError('Movie not found')

    // create rating
    const rating = await Rating.create({
      rating_user_id: userId,
      rating_movie_id: movieId,
      rating_value: ratingValue
    })

    if (!rating) throw new BadRequestError('Add rating error')

    const updateMovie = await Movie.findOneAndUpdate(
      { _id: movieId },
      {
        $inc: {
          rating_count: 1,
          total_rating_value: ratingValue
        }
      },
      { new: true }
    )

    if (!updateMovie) throw new BadRequestError('Update rating movie error')

    return rating
  }

  static getListRating = async ({ userId }) => {
    const select = unGetSelectData(['__v', 'userId'])

    const rating = await Rating.find({ rating_user_id: userId })
      .select(select)
      .lean()
    if (!rating) throw new BadRequestError('Get list rating error')

    return rating
  }

  static updateRating = async ({
    userId,
    movieId,
    ratingValue,
    oldRatingValue
  }) => {
    const rating = await Rating.findOneAndUpdate(
      {
        rating_user_id: userId,
        rating_movie_id: movieId
      },
      {
        rating_value: ratingValue
      },
      { new: true }
    )
    if (!rating) throw new BadRequestError('Update rating error')

    const query = { _id: movieId }
    const update = {
      $inc: {
        total_rating_value: ratingValue - oldRatingValue
      }
    }
    const options = { new: true }

    const updateMovie = await Movie.findOneAndUpdate(query, update, options)
    if (!updateMovie) throw new BadRequestError('Update rating in movie error')

    return rating
  }
}

module.exports = RatingService
