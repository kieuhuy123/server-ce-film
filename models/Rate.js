const mongoose = require('mongoose')
const { Schema } = mongoose

const RateSchema = new Schema(
  {
    userId: mongoose.Types.ObjectId,
    movieId: mongoose.Types.ObjectId,
    value: { type: Number, require: true }
  },
  {
    timestamps: true
  }
)

RateSchema.index({ userId: 1, movieId: 1 })

module.exports = mongoose.model('Rate', RateSchema)
