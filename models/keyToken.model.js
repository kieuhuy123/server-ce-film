const mongoose = require('mongoose')
const { Schema } = mongoose

const keyTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    privateKey: {
      type: String,
      required: true
    },
    publicKey: {
      type: String,
      required: true
    },
    refreshTokenUsed: {
      type: Array,
      default: [] // nhung refreshToken da duoc su dung
    },
    refreshToken: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Key', keyTokenSchema)
