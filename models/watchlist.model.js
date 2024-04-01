const mongoose = require('mongoose')
const { Schema } = mongoose

const DOCUMENT_NAME = 'Watchlist'
const COLLECTION_NAME = 'Watchlists'

const WatchlistSchema = new Schema(
  {
    watchlist_user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    watchlist_movies: { type: Array, required: true, default: [] }
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
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

module.exports = mongoose.model(DOCUMENT_NAME, WatchlistSchema)
