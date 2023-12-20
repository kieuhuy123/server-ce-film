const mongoose = require('mongoose')
const { Schema } = mongoose

const MovieSchema = new Schema(
  {
    title: { type: String, require: true },
    alias: { type: String, require: true },
    genre: { type: [String], require: true },
    type: { type: String, require: true },
    image: { type: String, require: true },
    rateCount: { type: Number, default: 0 },
    rateValue: { type: Number, default: 0 },
    trailer: String,
    review: String,
    video: String,
    info: {
      time: Number,
      nation: String,
      publish: Number,
      directors: [String],
      actors: [String]
    }
  },
  {
    timestamps: true
  }
)

MovieSchema.index({ alias: 'text' })

module.exports = mongoose.model('Movie', MovieSchema)
