'use strict'

const { Created, Ok } = require('../core/success.response')
const OrderService = require('../services/order.service')

class PackageController {
  checkoutReview = async (req, res, next) => {
    new Ok({
      message: 'checkout review OK',
      metadata: await OrderService.checkoutReview(req.body)
    }).send(res)
  }

  orderByUser = async (req, res, next) => {
    new Ok({
      message: 'Order OK',
      metadata: await OrderService.orderByUser(req.body)
    }).send(res)
  }
}

module.exports = new PackageController()
