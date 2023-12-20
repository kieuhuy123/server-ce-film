const Movie = require('../models/Movie')
const { unGetSelectData } = require('../utils')

const getAllMovies = async (req, res) => {
  const { page } = req.query
  try {
    const limit = 6
    const startIndex = (Number(page) - 1) * limit
    const sortBy = { _id: -1 }
    const select = unGetSelectData(['info', '__v', 'genre', 'review'])

    const total = await Movie.countDocuments({})

    const movies = await Movie.find()
      .sort(sortBy)
      .limit(limit)
      .skip(startIndex)
      .select(select)
      .lean()

    res.json({
      data: movies,
      currentPage: Number(page),
      totalTours: total,
      numberOfPages: Math.ceil(total / limit)
    })
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

const getMovie = async (req, res) => {
  const { alias } = req.params

  try {
    const movie = await Movie.findOne({ alias }).exec()
    res.status(200).json(movie)
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

const createNewMovie = async (req, res) => {
  const {
    title,
    type,
    alias,
    genre,
    rate,
    image,
    trailer,
    review,
    video,
    info
  } = req.body

  // Confirm data
  if (
    !genre ||
    !type ||
    !alias ||
    !title ||
    !rate ||
    !image ||
    !trailer ||
    !review ||
    !video ||
    !info
  ) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  // check duplicate
  const duplicate = await Movie.findOne({ alias }).lean()
  if (duplicate)
    return res.status(400).json({ message: 'Alias movie already used!' })
  // Create and store the new user
  const movie = await Movie.create({
    title,
    alias,
    genre,
    rate,
    image,
    trailer,
    review,
    video,
    info
  })

  if (movie) {
    // Created
    return res.status(201).json({ message: 'New movie created' })
  } else {
    return res.status(400).json({ message: 'Invalid movie data received' })
  }
}

const updateMovie = async (req, res) => {
  const { alias } = req.params

  const { title, type, genre, image, trailer, review, video, info } = req.body

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
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    const movie = await Movie.findOne({ alias }).exec()

    if (!movie) return res.status(400).json({ message: 'Movie not found' })

    movie.title = title
    movie.type = type
    movie.genre = genre
    movie.alias = alias
    movie.image = image
    movie.trailer = trailer
    movie.review = review
    movie.video = video
    movie.info = info

    const updateMovie = await movie.save()
    res.json(`${updateMovie.title} update`)
  } catch (error) {
    res.status(404).json({ message: 'Movie update fail' })
  }
}

const deleteMovie = async (req, res) => {
  const { alias } = req.params

  try {
    const movie = await Movie.findOneAndDelete({ alias }).exec()
    res.status(200).json({ message: `${movie.title} deleted` })
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

const getRelatedMovies = async (req, res) => {
  const { alias, genre } = req.body
  if (!alias || !genre)
    res.status(400).json({ message: 'genre and alias are required' })

  try {
    const relatedMovies = await Movie.find({
      alias: { $nin: [alias] },
      genre: { $in: genre }
    })

    res.status(200).json(relatedMovies)
  } catch (error) {
    res.status(404).json({ message: 'Get related movies fail' })
  }
}

module.exports = {
  createNewMovie,
  getAllMovies,
  getMovie,
  updateMovie,
  deleteMovie,
  getRelatedMovies
}
