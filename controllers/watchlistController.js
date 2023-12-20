const Watchlist = require('../models/Watchlist')
const { Types } = require('mongoose')
const { getMovieById } = require('../models/repositories/movie.repo')

const createUserWatchlist = async ({ userId, movie }) => {
  const query = { watchlist_userId: userId }
  const updateOrInsert = {
    $addToSet: {
      watchlist_movies: movie
    }
  }
  const options = { upsert: true, new: true }

  return await Watchlist.findOneAndUpdate(query, updateOrInsert, options)
}

const addToWatchlist = async (req, res) => {
  const { userId, movieId } = req.body

  if (!movieId || !userId) {
    return res.status(400).json({ message: 'movieId and userId are required' })
  }

  try {
    const unSelect = ['__v', 'info', 'review', 'trailer', 'video']
    const movie = await getMovieById({ movieId, unSelect })

    const watchlist = await createUserWatchlist({ userId, movie })

    return res
      .status(201)
      .json({ message: 'New watchlist created', data: watchlist })
  } catch (error) {
    return res.status(400).json({ message: 'Invalid watchlist data received' })
  }
}

const getWatchlists = async (req, res) => {
  const { userId } = req.query

  if (!userId) return res.status(400).json({ message: 'userId are required' })

  try {
    const watchlist = await Watchlist.findOne({
      watchlist_userId: userId
    }).lean()
    return res.status(200).json(watchlist)
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

const removeFromWatchlist = async (req, res) => {
  const { userId, movieId, alias } = req.body

  if (!userId) return res.status(401).json({ message: 'Unauthorized' })

  if (!movieId) return res.status(400).json({ message: 'movieId are required' })

  try {
    const query = { watchlist_userId: new Types.ObjectId(userId) }

    const updateSet = {
      $pull: {
        watchlist_movies: {
          _id: new Types.ObjectId(movieId)
        }
      }
    }

    const removeMovie = await Watchlist.updateOne(query, updateSet)
    res.status(200).json({ message: `Movie  was deleted`, data: removeMovie })
  } catch (error) {
    return res.status(400).json({ message: 'Some thing went wrong' })
  }
}

module.exports = {
  getWatchlists,
  addToWatchlist,
  removeFromWatchlist
}
