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

class AccessService {
  static register = async ({ email, password }) => {
    try {
      //  check for duplicate email in the db
      const duplicate = await User.findOne({ email: email }).lean()
      if (duplicate) {
        return {
          code: '4009',
          message: 'Email address already in use'
        }
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
          return {
            code: '4000',
            message: 'keyUser error'
          }
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
          code: 201,
          metadata: {
            user: getInfoData({ paths: ['_id', 'email'], object: newUser }),
            tokens
          }
        }
      }

      return {
        code: 200,
        metadata: null
      }
    } catch (error) {
      return {
        code: '400',
        message: error.message,
        status: 'error'
      }
    }
  }
}

module.exports = AccessService
