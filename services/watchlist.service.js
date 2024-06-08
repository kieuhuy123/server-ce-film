'use strict'

const Watchlist = require('../models/watchlist.model')

const { BadRequestError } = require('../core/error.response')
const { unGetSelectData } = require('../utils')
const { getMovieById } = require('../models/repositories/movie.repo')
const { Types } = require('mongoose')
const { getRedis } = require('../dbs/init.redis')

const { instanceConnect: redisClient } = getRedis()

class WatchlistService {
  static createUserWatchlist = async ({ userId, movie }) => {
    const query = { watchlist_user_id: userId }
    const updateOrInsert = {
      $addToSet: {
        watchlist_movies: movie
      }
    }
    const options = {
      upsert: true,
      new: true
    }

    return await Watchlist.findOneAndUpdate(query, updateOrInsert, options)
  }

  static addToWatchlist = async ({ userId, movieId }) => {
    const unSelect = ['__v', 'info', 'review', 'trailer', 'video']
    const movie = await getMovieById({ movieId, unSelect })

    const watchlist = await WatchlistService.createUserWatchlist({
      userId,
      movie
    })

    if (!watchlist) throw new BadRequestError('Add movie to watchlist error')

    // Update cache in redis
    await redisClient.json.del(`watchlist:${userId}`)
    await redisClient.json.set(`watchlist:${userId}`, '$', watchlist)
    await redisClient.expire(`watchlist:${userId}`, 60 * 60)

    return watchlist
  }

  static getWatchlist = async ({ userId }) => {
    const dataCached = await redisClient.json.get(
      'watchlist:663ddab661580524674a3fa2'
    )

    if (dataCached) {
      return dataCached
    }

    const watchlist = await Watchlist.findOne({
      watchlist_user_id: userId
    }).lean()

    if (!watchlist) throw new BadRequestError('get watchlist error')

    return watchlist
  }

  static removeFromWatchlist = async ({ userId, movieId }) => {
    const query = { watchlist_user_id: new Types.ObjectId(userId) }

    const updateSet = {
      $pull: {
        watchlist_movies: {
          _id: new Types.ObjectId(movieId)
        }
      }
    }
    const options = {
      new: true
    }

    const watchlist = await Watchlist.findOneAndUpdate(
      query,
      updateSet,
      options
    )

    if (!watchlist)
      throw new BadRequestError('Remove movie from watchlist error')
    // Update cache in redis
    await redisClient.json.del(`watchlist:${userId}`)
    await redisClient.json.set(`watchlist:${userId}`, '$', watchlist)
    await redisClient.expire(`watchlist:${userId}`, 60 * 60)
    return watchlist
  }
}

module.exports = WatchlistService
