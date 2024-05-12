'use strict'

const mongoose = require('mongoose')
const { Schema } = mongoose

const DOCUMENT_NAME = 'Package'
const COLLECTION_NAME = 'Packages'

// COMMENT-001: NEW comment
// MOVIE-001: New movie
const packageSchema = new Schema(
  {
    package_name: { type: String, required: true },
    package_type: { type: String, required: true },
    package_banner: { type: String },
    package_plan: { type: Array, default: [] },
    /*
    package_plan : {
        [
            {
            "id": 1,
            "name": "01 Tháng",
            "description": "",
            "price": 79000,
            "value_date": 30,
            "start_date": "",
            "expired_date": ""
          },
        ]
    }
    */
    // package_start_date: { type: String, default: '' },
    package_expired_date: { type: String, default: '' },
    package_is_buy: { type: Boolean, default: false }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const packagePlanSchema = new Schema(
  {
    plan_group: { type: Schema.Types.ObjectId, ref: 'Package' },
    plan_name: { type: String, required: true },
    plan_description: { type: String },
    plan_type: { type: String, required: true },
    plan_price: { type: Number, required: true },
    plan_value_date: { type: Number, required: true }
  },
  { timestamps: true, collection: 'PackagePlans' }
)

const packageExpiredSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    package_type: { type: String, required: true },
    // expired_after_seconds: { type: String, required: true },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: 0
    }
  },
  { timestamps: true, collection: 'PackageExpired' }
)

// packageExpiredSchema
//   .pre('save', function (next) {
//     console.log('tao index expired ne', this.expired_after_seconds)
//     // this.index(
//     //   { createdAt: 1 },
//     //   { expireAfterSeconds: this.expired_after_seconds }
//     // )
//     next()
//   })
//   .index({ createdAt: 1 }, { expireAfterSeconds: this.expired_after_seconds })

module.exports = {
  packageModel: mongoose.model(DOCUMENT_NAME, packageSchema),
  packagePlanModel: mongoose.model('PackagePlan', packagePlanSchema),
  packageExpired: mongoose.model('PackagesExpired', packageExpiredSchema)
}
