'use strict'

const express = require('express')
const router = express.Router()
const PackageController = require('../../controllers/package.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../middleware/checkAuth')

// router.use(authenticationV2)
router
  .route('/')
  .post(asyncHandler(PackageController.createPackage))
  .get(asyncHandler(PackageController.getPackages))

router.route('/plan').post(asyncHandler(PackageController.createPackagePlan))
module.exports = router
