const Rate = require('../models/Rate')
const Movie = require('../models/Movie')
const { unGetSelectData } = require('../utils')

const rateMovie = async (req, res) => {
  const { userId, movieId, rateValue } = req.body
  if (!userId) return res.status(401).json({ message: 'Unauthorized' })
  if (!movieId || !rateValue)
    return res
      .status(400)
      .json({ message: 'MovieId and rateValue are required!' })

  try {
    const rating = await Rate.create({
      userId,
      movieId,
      value: rateValue
    })

    const query = { _id: movieId }
    const update = {
      $inc: {
        rateCount: 1,
        rateValue: rateValue
      }
    }
    const options = { new: true }

    const updateMovie = await Movie.findOneAndUpdate(query, update, options)

    if (!updateMovie) {
      res.status(400).json({ message: 'Update rate in movie fail!' })
    }

    res.status(200).json(rating)
  } catch (error) {
    res.status(400).json({ message: 'Create rating fail!' })
  }
}

const getRatedMovie = async (req, res) => {
  const { userId } = req.params
  if (!userId) return res.status(400).json({ message: 'userId are required!' })

  try {
    const filter = { userId }
    const select = unGetSelectData(['__v', 'userId'])

    const ratedMovies = await Rate.find(filter).select(select).lean()

    res.status(200).json(ratedMovies)
  } catch (error) {
    res.status(400).json({ message: 'Something went wrong!' })
  }
}

module.exports = {
  rateMovie,
  getRatedMovie
}
