'use strict'

const keyTokenModel = require('../models/keyToken.model')
const { Types } = require('mongoose')
const { convertToObjectId } = require('../utils')
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken
  }) => {
    try {
      /* lv0 */

      // const tokens = await keyTokenModel.create({
      //   userId,
      //   publicKey,
      //   privateKey
      // })

      // return tokens ? tokens.publicKey : null

      /* lv xxx*/
      const filter = { userId }
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken
      }
      const options = { upsert: true, new: true }

      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      )

      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }

  static findByUserId = async userId => {
    return await keyTokenModel.findOne({ userId: convertToObjectId(userId) })
  }

  static findByRefreshTokenUsed = async refreshToken => {
    return await keyTokenModel
      .findOne({ refreshTokenUsed: refreshToken })
      .lean()
  }

  static findByRefreshToken = async refreshToken => {
    return await keyTokenModel.findOne({ refreshToken })
  }

  static deleteKeyByUserId = async userId => {
    return await keyTokenModel.deleteOne({ userId: new Types.ObjectId(userId) })
  }
}

module.exports = KeyTokenService
