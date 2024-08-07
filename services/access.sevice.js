'use strict'

const User = require('../models/User')
const bcrypt = require('bcrypt')
const rolesList = require('../config/rolesList')
const crypto = require('node:crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair, verifyJWT } = require('../utils/auth')
const { getInfoData } = require('../utils')
const {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  ForbiddenError
} = require('../core/error.response')
const { findByEmail } = require('./user.service')

const saltRounds = 10
class AccessService {
  /* 
      1 - check email in dbs
      2 - match password
      3 - create keys and save
      4 - generate tokens
      5 - get data return login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    // 1.
    const foundUser = await findByEmail({ email })
    if (!foundUser) throw new ForbiddenError('User not registered')

    // 2.
    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) throw new AuthFailureError('Password is incorrect')

    // 3.
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    // 4. created token pair
    const { _id: userId } = foundUser

    const tokens = await createTokenPair(
      { userId, email, roles: foundUser.roles },
      publicKey,
      privateKey
    )

    const keyUser = await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    })

    if (!keyUser) {
      throw new ForbiddenError('keyUser error')
    }

    return {
      user: getInfoData({ paths: ['_id', 'email'], object: foundUser }),
      tokens
    }
  }

  /*
  1. Check email in dbs
    - Neu da co email ma chua co googleId => ERROR: duplicate
    - Neu chua co email => register and login
    - Neu da co email va co googleId => login
  2 - create keys and save
  3 - generate tokens
  4 - get data return login
    
  */
  static googleLogin = async ({ email, googleId }) => {
    // 1. Check email
    const foundUser = await findByEmail({ email })

    if (foundUser && !foundUser.googleId) {
      throw new ConflictRequestError('Error: Email already register')
    }

    // Đã có tk login bằng google
    if (foundUser) {
      // 2.
      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')
      // 3.
      const { _id: userId } = foundUser

      const tokens = await createTokenPair(
        { userId, email, roles: foundUser.roles },
        publicKey,
        privateKey
      )

      const keyUser = await KeyTokenService.createKeyToken({
        userId,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken
      })

      if (!keyUser) {
        throw new ForbiddenError('keyUser error')
      }
      // 4.
      return {
        user: getInfoData({ paths: ['_id', 'email'], object: foundUser }),
        tokens
      }
    }

    // Chưa có email được đăng ký
    const newUser = await User.create({
      email,
      roles: [rolesList.User],
      googleId: googleId
    })

    if (!newUser) throw new BadRequestError('Register with google error')

    // 2.
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')
    // 3.
    const tokens = await createTokenPair(
      { userId: newUser._id, email, roles: newUser.roles },
      publicKey,
      privateKey
    )

    const keyUser = await KeyTokenService.createKeyToken({
      userId: newUser._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    })

    if (!keyUser) {
      throw new ForbiddenError('keyUser error')
    }

    return {
      user: getInfoData({ paths: ['_id', 'email'], object: newUser }),
      tokens
    }
  }

  static register = async ({ email, password }) => {
    //  check for duplicate email in the db
    const duplicate = await findByEmail({ email })
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
      // created token pair
      const tokens = await createTokenPair(
        { userId: newUser._id, email, roles: newUser.roles },
        publicKey,
        privateKey
      )
      const keyUser = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken
      })

      if (!keyUser) {
        throw new ForbiddenError('keyUser error')
      }

      return {
        user: getInfoData({ paths: ['_id', 'email'], object: newUser }),
        tokens
      }
    }

    throw new BadRequestError('Register error')
  }

  static logout = async keyStore => {
    const delKey = await KeyTokenService.deleteKeyByUserId(keyStore.userId)

    return delKey
  }

  /* 
    1 - Check token used?
  */
  static handleRefreshToken = async refreshToken => {
    // check xem token nay da duoc su dung chua?
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    )

    // neu co
    if (foundToken) {
      // decode de xem info
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      )

      // xoa tat ca token trong keyStore
      await KeyTokenService.deleteKeyByUserId(userId)
      throw new ForbiddenError('Something wrong happen!! Please reLogin')
    }

    // neu khong => Oke

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    if (!holderToken) throw new AuthFailureError('User not registered!')

    // verifyToken
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    )
    console.log('[2]--', { userId, email })
    // check userId
    const foundUser = await findByEmail({ email })
    if (!foundUser) throw new AuthFailureError('User not registered')

    // Create 1 cap token moi
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    )

    // update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokenUsed: refreshToken // da duoc su dung de lay token moi
      }
    })

    return {
      user: { userId, email },
      tokens
    }
  }

  static handleRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyByUserId(userId)
      // logout and reload
      throw new ForbiddenError('Something wrong happen!! Please reLogin')
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError('User not registered!')
    }

    const foundUser = await findByEmail({ email })
    if (!foundUser) throw new AuthFailureError('User not registered')

    // Create 1 cap token moi
    const tokens = await createTokenPair(
      { userId, email, roles: foundUser.roles },
      keyStore.publicKey,
      keyStore.privateKey
    )

    // update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokenUsed: refreshToken // da duoc su dung de lay token moi
      }
    })

    return {
      user,
      tokens
    }
  }
}

module.exports = AccessService
