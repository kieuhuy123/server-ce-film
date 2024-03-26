const mongoose = require('mongoose')
const { Schema } = mongoose

const DOCUMENT_NAME = 'Rating'
const COLLECTION_NAME = 'Ratings'

const RatingSchema = new Schema(
  {
    rating_user_id: { type: mongoose.Types.ObjectId, required: true },
    rating_movie_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Movie'
    },
    rating_value: { type: Number, require: true }
    /* 
    [
      {
        _id:
        title: { type: String },
        alias: String,
        image: String,
        total_rating_value: Number,
        rated_count: Number
   
      }
    ]
    */
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

RatingSchema.index({ rating_user_id: 1, rating_movie_id: 1 })

module.exports = mongoose.model(DOCUMENT_NAME, RatingSchema)
