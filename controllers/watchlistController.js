const Watchlist = require('../models/Watchlist')

const getWatchlists = async (req, res) => {
  const { user_email } = req.params

  if (!user_email)
    return res.status(400).json({ message: 'User email are required' })

  try {
    const watchlist = await Watchlist.find({ user_email })
    return res.status(200).json(watchlist)
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong' })
  }
}

const addToWatchlist = async (req, res) => {
  const { user_email, movie_id, title, alias, rate, image } = req.body

  if (!user_email) return res.status(401).json({ message: 'Unauthorized' })

  // Confirm data
  if (!movie_id || !alias || !title || !rate || !image) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  // check duplicate movie
  const duplicate = await Watchlist.findOne({ user_email, movie_id }).lean()
  if (duplicate)
    return res.status(400).json({ message: 'Movie already in watchlist' })
  try {
    const watchlist = await Watchlist.create({
      user_email,
      movie_id,
      title,
      alias,
      rate,
      image
    })
    if (watchlist) {
      return res
        .status(201)
        .json({ data: watchlist, message: 'New watchlist created' })
    }
  } catch (error) {
    return res.status(400).json({ message: 'Invalid watchlist data received' })
  }
}

const removeFromWatchlist = async (req, res) => {
  const { user_email, movie_id } = req.body

  if (!user_email) return res.status(401).json({ message: 'Unauthorized' })

  if (!movie_id)
    return res.status(400).json({ message: 'Movie Id are required' })

  try {
    const watchlist = await Watchlist.findOneAndDelete({
      user_email,
      movie_id
    }).exec()

    return res.status(200).json({ message: `Movie id:${movie_id} was deleted` })
  } catch (error) {
    return res.status(400).json({ message: 'Some thing went wrong' })
  }
}

module.exports = {
  getWatchlists,
  addToWatchlist,
  removeFromWatchlist
}
