const mongoose = require('mongoose')
const { Schema } = mongoose

const keyTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'User'
    },
    privateKey: {
      type: String,
      require: true
    },
    publicKey: {
      type: String,
      require: true
    },
    refreshTokenUsed: {
      type: Array,
      default: [] // nhung refreshToken da duoc su dung
    },
    refreshToken: {
      type: String,
      require: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Key', keyTokenSchema)
