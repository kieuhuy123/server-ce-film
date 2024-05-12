'use strict'

const mongoose = require('mongoose')
const { Schema } = mongoose

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

// COMMENT-001: NEW comment
// MOVIE-001: New movie
const packageSchema = new Schema(
  {
    order_user_id: { type: Schema.Types.ObjectId, required: true },
    order_checkout: { type: Object, default: {} },
    /* 
        order_checkout = {
          totalPrice, // tong tien hang
          totalDiscount, // tong tien giam gia
          totalCheckout // tong thanh toan
        }
    */
    order_payment: { type: Object, default: {} },
    order_package: { type: Object, required: true },
    /*
     package_order:{
        package_plan_id,
        package_discounts: {
          packageId,
          discountId,
          codeId
        }
    }
    */
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

module.exports = mongoose.model(DOCUMENT_NAME, packageSchema)
