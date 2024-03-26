const mongoose = require('mongoose')
const { Schema } = mongoose

const DOCUMENT_NAME = 'Watchlist'
const COLLECTION_NAME = 'Watchlists'

const WatchlistSchema = new Schema(
  {
    watchlist_user_id: { type: mongoose.Types.ObjectId, required: true },
    watchlist_movies: { type: Array, required: true, default: [] },
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
    watchlist_has_outlier: { type: Boolean, required: true, default: false },
    watchlist_count: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

module.exports = mongoose.model(DOCUMENT_NAME, WatchlistSchema)
