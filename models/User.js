const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema(
  {
    email: { type: String, require: true },
    roles: { type: [Number], default: [2002] },
    password: { type: String, require: true }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('User', UserSchema)
