'use strict'

const {
  BadRequestError,
  ConflictRequestError
} = require('../core/error.response')

const { packageModel, packagePlanModel } = require('../models/package.model')
const { getPackages } = require('../models/repositories/package.repo')
const { convertToObjectId } = require('../utils')

class PackageService {
  static createPackage = async ({ packageName, packageType, packagePlan }) => {
    const newPackage = await packageModel.create({
      package_name: packageName,
      package_type: packageType,
      package_plan: packagePlan
    })

    if (!newPackage) throw new BadRequestError('Create package error')

    return newPackage
  }

  static createPackagePlan = async payload => {
    const {
      plan_group,
      plan_name,
      plan_description,
      plan_type,
      plan_price,
      plan_value_date
    } = payload

    const newPackagePlan = await packagePlanModel.create({
      plan_group,
      plan_name,
      plan_description,
      plan_type,
      plan_price,
      plan_value_date
    })

    if (!newPackagePlan)
      throw new BadRequestError('Create new package plan error')

    await packageModel.findOneAndUpdate(
      { _id: convertToObjectId(plan_group) },
      {
        $push: {
          package_plan: newPackagePlan
        }
      }
    )

    return newPackagePlan
  }

  static getPackages = async () => {
    const unselect = [
      '__v',
      'package_plan.createdAt',
      'package_plan.updatedAt',
      'package_plan.__v'
    ]
    const packages = await getPackages({ unselect })
    if (!packages) throw new BadRequestError('Get packages error')

    return packages
  }
}
module.exports = PackageService
