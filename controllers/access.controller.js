'use strict'

const { Created } = require('../core/success.response')
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
}

module.exports = new AccessController()
