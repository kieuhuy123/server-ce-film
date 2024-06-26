'use strict'

const { BadRequestError } = require('../core/error.response')
const { Created, Ok } = require('../core/success.response')
const AccessService = require('../services/access.sevice')

class AccessController {
  register = async (req, res, next) => {
    /* 
      200 OK
      201 CREATED
    */
    const data = await AccessService.register(req.body)
    const { tokens } = data
    new Created({
      message: 'Register Ok',
      metadata: data
      // options: { limit: 10 }
    }).send(
      res.cookie('jwt', tokens.refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: 'None', //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expire: set to match rT
      })
    )
  }

  login = async (req, res, next) => {
    const { email } = req.body
    if (!email) throw new BadRequestError('email missing')
    const data = await AccessService.login(req.body)
    const { tokens } = data

    new Ok({
      message: 'Login Ok',
      metadata: data
    }).send(
      res.cookie('jwt', tokens.refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: 'None', //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expire: set to match rT
      })
    )
  }

  googleLogin = async (req, res, next) => {
    const { email } = req.body
    if (!email) throw new BadRequestError('email missing')
    const data = await AccessService.googleLogin(req.body)
    const { tokens } = data

    new Ok({
      message: 'Login with Google Ok',
      metadata: data
    }).send(
      res.cookie('jwt', tokens.refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: 'None', //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expire: set to match rT
      })
    )
  }

  logout = async (req, res, next) => {
    new Ok({
      message: 'Logout success',
      metadata: await AccessService.logout(req.keyStore)
    }).send(
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
      })
    )
  }

  handleRefreshToken = async (req, res, next) => {
    const data = await AccessService.handleRefreshTokenV2({
      refreshToken: req.refreshToken,
      user: req.user,
      keyStore: req.keyStore
    })

    const { tokens: newTokens } = data
    new Ok({
      message: 'Get token success',
      metadata: data
    }).send(
      res.cookie('jwt', newTokens.refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: 'None', //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
      })
    )
  }
}

module.exports = new AccessController()
