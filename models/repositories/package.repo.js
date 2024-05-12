const {
  unGetSelectData,
  getSelectData,
  convertToObjectId
} = require('../../utils')
const { packageModel, packagePlanModel } = require('../package.model')

const getPackagePlanById = async PlanId => {
  return await packagePlanModel
    .findOne({ _id: convertToObjectId(PlanId) })
    .lean()
}
const checkPackagePlanByServer = async PlanId => {
  const foundPackagePlan = await getPackagePlanById(PlanId)

  if (foundPackagePlan) {
    return {
      price: foundPackagePlan.plan_price,
      type: foundPackagePlan.plan_type,
      value_date: foundPackagePlan.plan_value_date
    }
  }
}

module.exports = { checkPackagePlanByServer }
