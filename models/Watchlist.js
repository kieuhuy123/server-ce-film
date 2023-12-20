const mongoose = require('mongoose')
const { Schema } = mongoose

const WatchlistSchema = new Schema(
  {
    watchlist_userId: { type: mongoose.Types.ObjectId, require: true },
    watchlist_movies: { type: Array, require: true, default: [] }
    /* 
    [
      {
        movieId:
        title: { type: String },
        alias: String,
        image: String,
        rateValue: Number,
        rateCount: Number
      }
    ]
    */
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Watchlist', WatchlistSchema)
