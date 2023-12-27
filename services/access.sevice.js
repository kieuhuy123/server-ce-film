'use strict'

const User = require('../models/User')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const rolesList = require('../config/rolesList')
const crypto = require('node:crypto')
const KeyTokenService = require('./keyToken.sevice')
const { createTokenPair } = require('../utils/auth')
const { getInfoData } = require('../utils')
const {
  ConflictRequestError,
  BadRequestError
} = require('../core/error.response')

class AccessService {
  static register = async ({ email, password }) => {
    //  check for duplicate email in the db
    const duplicate = await User.findOne({ email: email }).lean()
    if (duplicate) {
      throw new ConflictRequestError('Error: User already register')
    }

    // encrypt the password
    const hashPwd = await bcrypt.hash(password, saltRounds)
    // create and store new user
    const newUser = await User.create({
      email: email,
      password: hashPwd,
      roles: [rolesList.User]
    })

    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')

      console.log({ privateKey, publicKey })

      const keyUser = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey
      })

      if (!keyUser) {
        throw new BadRequestError('keyUser error')
      }

      console.log(`keyUser::`, keyUser)

      // created token pair

      const tokens = await createTokenPair(
        { userId: newUser._id, email, roles: newUser.roles },
        publicKey,
        privateKey
      )
      console.log(`Created Token Success::`, tokens)

      return {
        user: getInfoData({ paths: ['_id', 'email'], object: newUser }),
        tokens
      }
    }

    throw new BadRequestError('Register error')
  }
}

module.exports = AccessService
