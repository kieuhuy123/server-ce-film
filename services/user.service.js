'use strict'

const User = require('../models/User')
const { getSelectData } = require('../utils')

const findByEmail = async ({ email }) => {
  const select = getSelectData(['email', 'password', 'roles', 'googleId'])
  return await User.findOne({ email }).select(select).lean()
}

module.exports = {
  findByEmail
}
