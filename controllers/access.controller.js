'use strict'

const { Created, Ok } = require('../core/success.response')
const AccessService = require('../services/access.sevice')

class AccessController {
  register = async (req, res, next) => {
    /* 
      200 OK
      201 CREATED
    */
    new Created({
      message: 'Register Ok',
      metadata: await AccessService.register(req.body),
      options: { limit: 10 }
    }).send(res)
  }

  login = async (req, res, next) => {
    new Ok({
      message: 'Login Ok',
      metadata: await AccessService.login(req.body)
    }).send(res)
  }

  logout = async (req, res, next) => {
    new Ok({
      message: 'Logout success',
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)
  }
}

module.exports = new AccessController()
