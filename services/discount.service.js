'use strict'
const discountModel = require('../models/discount.model')
const {
  checkDiscountExists,
  findAllDiscountCodesUnSelect
} = require('../models/repositories/discount.repo')
const { convertToObjectId } = require('../utils')
const { BadRequestError, NotFoundError } = require('../core/error.response')
class DiscountService {
  static async createDiscountCode (payload) {
    // Validate theo  builder pattern
    console.log('payload', payload)
    //
    const {
      code,
      start_date,
      end_date,
      is_active,
      // userId,
      min_order_value,
      user_ids,
      applies_to,
      name,
      description,
      type,
      users_used,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user
    } = payload

    // validate
    if (new Date() > new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError('Discount code has expired')
    }

    if (new Date(end_date) < new Date(start_date)) {
      throw new BadRequestError('End date more than start date')
    }

    // create index for discount code
    const filter = {
      discount_code: code
      // discount_user_id: convertToObjectId(userId)
    }
    const foundDiscount = await checkDiscountExists(filter)
    console.log('code', code)
    console.log('foundDiscount', foundDiscount)
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount exists')
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_day: new Date(start_date),
      discount_end_day: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      // discount_user_id: userId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_user_ids: applies_to === 'all' ? [] : user_ids
    })
    if (!newDiscount) throw new BadRequestError('create discount error')
    return newDiscount
  }

  static async updateDiscountCode (payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      userId,
      min_order_value,
      user_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_users
    } = payload
  }

  static async getListDiscount ({ userId }) {
    // console.log('userId', userId)
    const filter = {
      // discount_user_id: convertToObjectId(userId),
      discount_applies_to: 'all',
      discount_is_active: true
    }
    const unSelect = ['__v', 'discount_user_id']
    const listDiscount = await findAllDiscountCodesUnSelect({
      filter,
      unSelect
    })
    if (!listDiscount) throw new BadRequestError('get list discount error')

    return listDiscount
  }

  /*
  Apply Discount Code
 */
  static async getDiscountAmount ({ codeId, userId, product }) {
    const filter = {
      discount_code: codeId
    }
    const foundDiscount = await checkDiscountExists(filter)

    if (!foundDiscount) {
      throw new BadRequestError('Discount not exists')
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_order_value,
      discount_users_used,
      discount_type,
      discount_value
    } = foundDiscount

    if (!discount_is_active) throw new BadRequestError('Discount expired')
    if (discount_max_uses === 0) throw new BadRequestError('Discount are out')

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    )
      throw new BadRequestError('Discount code has expired')

    // check xem co set gia tri toi thieu hay k
    let totalOrder = 0
    if (discount_min_order_value > 0) {
      // get total
      // totalOrder = products.reduce((acc, product) => {
      //   return acc + product.quantity * product.price
      // }, 0)

      totalOrder = product.price

      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError(
          `Discount requires a minium order value of ${discount_min_order_value}`
        )
      }
    }

    // check xem co set gia tri toi da nguoi su dung hay khong
    if (discount_max_uses_per_user > 0) {
      const userDiscount = discount_users_used.find(
        user => user.userId === userId
      )
      if (userDiscount) {
        // ..
      }
    }

    // check xem discount nay la fixed amount
    const amount =
      discount_type === 'fixed_amount'
        ? discount_value
        : totalOrder * (discount_value / 100)

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }

  // delete voucher
  static async deleteDiscountCode ({ userId, codeId }) {
    // kiem tra xem co dk su dung o dau khong, neu k co thi xoa
    return discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shop_id: convertToObjectId(userId)
    })
  }

  //
  static async cancelDiscountCode ({ codeId, userId }) {
    // check exists
    const filter = {
      discount_code: code
    }
    const foundDiscount = await checkDiscountExists(filter)

    if (!discountModel) throw new BadRequestError('Discount not exists')

    return discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_max_users: 1,
        discount_uses_count: -1
      }
    })
  }
}

module.exports = DiscountService
