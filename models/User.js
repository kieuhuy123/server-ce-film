const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String },
    roles: { type: [Number], default: [2002] },
    googleId: { type: String }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('User', UserSchema)
