const mongoose = require('mongoose')
const { Schema } = mongoose

const WatchlistSchema = new Schema({
  user_email: { type: String, require: true },
  movie_id: mongoose.Types.ObjectId,
  title: { type: String },
  alias: String,
  image: String,
  rate: Number
  //   list_movie: { type: Array, require: true, default: [] }
})

module.exports = mongoose.model('Watchlist', WatchlistSchema)
