'use strict'

const { Created, Ok } = require('../core/success.response')
const PackageService = require('../services/package.service')

class PackageController {
  createPackage = async (req, res, next) => {
    new Ok({
      message: 'Create Package OK',
      metadata: await PackageService.createPackage(req.body)
    }).send(res)
  }

  createPackagePlan = async (req, res, next) => {
    new Ok({
      message: 'Create Package plan OK',
      metadata: await PackageService.createPackagePlan(req.body)
    }).send(res)
  }
}

module.exports = new PackageController()
