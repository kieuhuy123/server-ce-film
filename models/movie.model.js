const mongoose = require('mongoose')
const { Schema } = mongoose

const MovieSchema = new Schema(
  {
    title: { type: String, required: true },
    alias: { type: String, required: true },
    genre: { type: [String], required: true },
    type: { type: String, required: true },
    image: { type: String, required: true },
    rating_count: { type: Number, default: 0 },
    total_rating_value: { type: Number, default: 0 },
    trailer: String,
    review: String,
    video: String,
    info: {
      time: Number,
      nation: String,
      publish: Number,
      directors: [String],
      actors: [String]
    },
    is_featured: Boolean,
    featured_image: String
  },
  {
    timestamps: true
  }
)

MovieSchema.index({ alias: 'text' })

module.exports = mongoose.model('Movie', MovieSchema)
