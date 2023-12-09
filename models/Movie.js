const mongoose = require('mongoose')
const { Schema } = mongoose

const MovieSchema = new Schema(
  {
    title: { type: String, require: true, index: true },
    alias: { type: String, require: true, index: true },
    rate: { type: Number, default: 7 },
    genre: { type: [String], require: true },
    type: { type: String, require: true },
    image: { type: String, require: true },
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

module.exports = mongoose.model('Movie', MovieSchema)
