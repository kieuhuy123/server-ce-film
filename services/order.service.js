'use strict'

const {
  BadRequestError,
  ConflictRequestError
} = require('../core/error.response')
const User = require('../models/User')
const orderModel = require('../models/order.model')
const {
  checkPackagePlanByServer
} = require('../models/repositories/package.repo')
const DiscountService = require('./discount.service')
const { updateUserPackage } = require('./user.service')

class OrderService {
  /*
  {
    userId,
    package_order:{
      package_plan_id,
      package_discounts: {
        packageId,
        discountId,
        codeId
      }
    }
  }
  */
  static checkoutReview = async ({ userId, package_order }) => {
    const checkout_order = {
      totalPrice: 0, // tong tien hang
      totalDiscount: 0, // tong tien giam gia
      totalCheckout: 0 // tong thanh toan
    }

    let package_order_new = {}

    const { package_plan_id, package_discounts = {} } = package_order

    // check package available
    const checkPackagePlanServer = await checkPackagePlanByServer(
      package_plan_id
    )
    if (!checkPackagePlanServer) throw new BadRequestError('Order invalid')

    // sum total order
    const checkoutPrice = checkPackagePlanServer.price

    // total before
    checkout_order.totalPrice = checkoutPrice

    const itemCheckout = {
      package_plan_id,
      package_discounts,
      priceRaw: checkoutPrice,
      priceApplyDiscount: checkoutPrice
    }

    if (Object.keys(package_discounts).length > 0) {
      const { totalPrice = 0, discount = 0 } =
        await DiscountService.getDiscountAmount({
          codeId: package_discounts.codeId,
          userId,
          product: checkPackagePlanServer
        })

      checkout_order.totalDiscount = discount

      if (discount > 0) {
        itemCheckout.priceApplyDiscount = checkoutPrice - discount
      }
    }

    // tong thanh toan cuoi cung
    checkout_order.totalCheckout = itemCheckout.priceApplyDiscount
    package_order_new = { ...itemCheckout }

    return {
      package_order,
      package_order_new,
      checkout_order
    }
  }

  static orderByUser = async ({
    userId,
    package_order_new,
    user_payment = {}
  }) => {
    const { checkout_order } = await OrderService.checkoutReview({
      userId,
      package_order: package_order_new
    })

    const newOrder = await orderModel.create({
      order_user_id: userId,
      order_checkout: checkout_order,
      order_payment: user_payment,
      order_package: package_order_new,
      order_status: 'confirmed'
    })

    if (!newOrder) throw new BadRequestError('Create order error')

    // Update package user
    const { package_plan_id } = package_order_new

    const checkPackagePlanServer = await checkPackagePlanByServer(
      package_plan_id
    )

    if (!checkPackagePlanServer)
      throw new BadRequestError('Update package user error')

    const { type, value_date } = checkPackagePlanServer
    // After order success => Update package in user
    const updateUser = await updateUserPackage({ userId, type, value_date })
    if (!updateUser) throw new BadRequestError('Update package user error')

    return newOrder
  }
}
module.exports = OrderService
