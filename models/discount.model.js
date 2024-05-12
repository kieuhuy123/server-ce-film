'use strict'

const mongoose = require('mongoose')
const { Schema } = mongoose

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true
    },
    discount_description: {
      type: String,
      required: true
    },
    discount_type: {
      type: String,
      default: 'fixed_amount' // percentage
    },
    discount_value: {
      type: String,
      required: true
    },
    discount_code: {
      type: String,
      required: true
    },
    discount_start_day: {
      type: Date,
      required: true
    },
    discount_end_day: {
      type: Date,
      required: true
    },
    discount_max_uses: {
      type: Number,
      required: true
    },
    discount_uses_count: {
      // so discount da su dung
      type: Number,
      required: true
    },
    discount_users_used: {
      // ai da su dung
      type: Array,
      default: []
    },
    discount_max_uses_per_user: {
      // so luong cho phep toi da duoc su dung moi user
      type: Number,
      required: true
    },
    discount_min_order_value: {
      // so gia tri don hang toi thieu
      type: Number,
      required: true
    },
    discount_user_ids: {
      // neu ap dung specific => them tung user duoc ap dung discount
      type: Array,
      default: []
    },
    // discount_user_id: {
    //   //
    //   type: Schema.Types.ObjectId,
    //   ref: 'User'
    // },
    discount_is_active: {
      type: Boolean,
      required: true
    },
    discount_applies_to: {
      // discount ap dung cho tat ca hay cho mot so nguoi
      type: String,
      required: true,
      enum: ['all', 'specific']
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

module.exports = mongoose.model(DOCUMENT_NAME, discountSchema)

// {
//   "name" : "name fixed amount",
//   "description": "description",
//   "type": "percentage",
//   "value": 30000,
//   "max_value": 30000,
//   "code": "CEFILM-1122",
//   "start_date": "2024-05-10 09:00:00",
//   "end_date": "2024-05-20 09:00:00",
//    "max_uses": 10,
//    "uses_count": 0,
//    "users_used": [],
//    "max_uses_per_user": 1,
//    "min_order_value": 200000,
//    "create_by": {},
//    "is_active": true,
//    "applise_to": "specific",
//    "user_ids": [""]
// }
