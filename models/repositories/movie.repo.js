const { unGetSelectData } = require('../../utils')
const Movie = require('../Movie')

const getMovieById = async ({ movieId, unSelect }) => {
  return await Movie.findById(movieId)
    .select(unGetSelectData(unSelect))
    .lean()
    .exec()
}

module.exports = {
  getMovieById
}
