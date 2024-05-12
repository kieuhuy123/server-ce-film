'use strict'

const { Created, Ok } = require('../core/success.response')
const DiscountService = require('../services/discount.service')

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new Ok({
      message: 'Create Discount code OK',
      metadata: await DiscountService.createDiscountCode({
        ...req.body
        // shopId: req.user.userId
      })
    }).send(res)
  }
  getListDiscount = async (req, res, next) => {
    new Ok({
      message: 'Create Discount code OK',
      metadata: await DiscountService.getListDiscount({
        // userId: req.user.userId
      })
    }).send(res)
  }
}

module.exports = new DiscountController()
