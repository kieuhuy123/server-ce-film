const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String },
    roles: { type: [Number], default: [2002] },
    googleId: { type: String },
    package_own: { type: String, default: '' },
    package_expired: { type: String, default: '' },
    convert_package_expired: { type: Date }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('User', UserSchema)
