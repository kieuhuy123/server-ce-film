const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: { type: [Number], default: [2002] }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('User', UserSchema)
