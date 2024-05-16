'use strict'

const { Created, Ok } = require('../core/success.response')
const { createPaymentIntents } = require('../services/checkout.service')

class CheckoutController {
  createPaymentIntents = async (req, res, next) => {
    new Ok({
      message: 'Create checkout session OK',
      metadata: await createPaymentIntents(req.body)
    }).send(res)
  }
}

module.exports = new CheckoutController()
