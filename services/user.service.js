'use strict'

const User = require('../models/User')

const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 2,
    roles: 1
  }
}) => {
  return await User.findOne({ email }).select(select).lean()
}

module.exports = {
  findByEmail
}
