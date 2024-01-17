const { unGetSelectData } = require('../../utils')
const movieModel = require('../movie.model')

const getMovieById = async ({ movieId, unSelect }) => {
  return await movieModel
    .findById(movieId)
    .select(unGetSelectData(unSelect))
    .lean()
    .exec()
}

const findAllMovies = async ({ filter = {}, limit, sort, page, select }) => {
  const skip = (Number(page) - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const movies = await movieModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean()

  return movies
}

const findMovieByAlias = async ({ alias, unSelect }) => {
  return await movieModel
    .findOne({ alias })
    .select(unGetSelectData(unSelect))
    .lean()
    .exec()
}

const updateMovieById = async ({ movieId, bodyUpdate, isNew = true }) => {
  return await movieModel.findByIdAndUpdate(movieId, bodyUpdate, { new: isNew })
}

const findMovieByGenre = async ({ movieId, genre }) => {
  return await movieModel
    .find({
      _id: { $nin: [movieId] },
      genre: { $in: genre }
    })
    .lean()
    .exec()
}

const findMovieByType = async ({ filter, limit, sort, page, select }) => {
  const skip = (Number(page) - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

  return await movieModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean()
}
module.exports = {
  getMovieById,
  findAllMovies,
  findMovieByAlias,
  updateMovieById,
  findMovieByGenre,
  findMovieByType
}
