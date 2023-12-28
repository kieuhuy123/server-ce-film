'use strict'

const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { asyncHandler } = require('../helpers/asyncHandler')
const { findById } = require('../services/apiKey.service')
const { findByUserId } = require('../services/keyToken.service')
const JWT = require('jsonwebtoken')

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()

    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }
    // check objKey
    const objKey = await findById(key)
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden Error'
      })
    }

    req.objKey = objKey
    return next()
  } catch (error) {
    return res.status(404).json({
      message: ' Error'
    })
  }
}
// function Closures
const permission = permission => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: 'permission denied '
      })
    }
    console.log('permission::', req.objKey.permissions)
    const validPermission = req.objKey.permissions.includes(permission)

    if (!validPermission) {
      return res.status(403).json({
        message: 'permission denied '
      })
    }

    return next()
  }
}

const authentication = asyncHandler(async (req, res, next) => {
  /*
      1 - Check userId missing??
      2 - Get accessToken
      3 - Verify Token
      4 - Check user in dbs
      5 - Check keyStore with this userId?
      6 - OK all => return next
  */

  // 1.
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid userId')

  // 2.
  const keyStore = await findByUserId(userId)
  if (!keyStore) throw new NotFoundError('Not found keyStore')

  // 3.
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureError('Invalid accessToken')

  // 4.
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if (userId !== decodeUser.userId)
      throw new AuthFailureError('Invalid userId')

    req.keyStore = keyStore
    console.log('keyStore checkAuth', keyStore)
    return next()
  } catch (error) {
    throw error
  }
})

module.exports = {
  apiKey,
  permission,
  authentication
}