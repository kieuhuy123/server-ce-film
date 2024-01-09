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

  const accessToken = req.headers[HEADER.AUTHORIZATION].split(' ')[1]

  if (!accessToken) throw new AuthFailureError('Invalid accessToken')

  // 4.
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if (userId !== decodeUser.userId)
      throw new AuthFailureError('Invalid userId')

    req.keyStore = keyStore

    return next()
  } catch (error) {
    throw error
  }
})

const authenticationV2 = asyncHandler(async (req, res, next) => {
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
  if (!keyStore) {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None',
      secure: true
    })
    throw new NotFoundError('Not found keyStore')
  }

  // 3.

  if (req.url === '/user/refreshToken' && req.cookies) {
    console.log('request::', req.url)
    try {
      const cookies = req.cookies
      console.log('cookies::', cookies)
      const refreshToken = cookies.jwt
      console.log('refreshToken::', refreshToken)
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)

      if (userId !== decodeUser.userId)
        throw new AuthFailureError('Invalid userId')

      req.keyStore = keyStore
      req.user = decodeUser
      req.refreshToken = refreshToken
      return next()
    } catch (error) {
      console.log('error', error)
      throw error
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION].split(' ')[1]

  if (!accessToken) throw new AuthFailureError('Invalid accessToken')

  // 4.
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if (userId !== decodeUser.userId)
      throw new AuthFailureError('Invalid userId')

    req.keyStore = keyStore

    return next()
  } catch (error) {
    if (error.name == 'TokenExpiredError') {
      // return res.status(200).json({
      //   code: 401,
      //   message: 'jwt expired',
      //   status: 'error'
      // })
      console.log('token het han ne')
      throw new AuthFailureError('jwt expired')
    }
    console.log('error ne', error)
    throw error
  }
})

module.exports = {
  apiKey,
  permission,
  authentication,
  authenticationV2
}
