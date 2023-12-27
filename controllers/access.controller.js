'use strict'

const AccessService = require('../services/access.sevice')

class AccessController {
  register = async (req, res, next) => {
    try {
      console.log(`[P]::signUp`, req.body)
      /* 
        200 OK
        201 CREATED
      */
      return res.status(201).json(await AccessService.register(req.body))
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AccessController()
