const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/order.controller')
// const { authenticationV2 } = require('../../middleware/checkAuth')
const { asyncHandler } = require('../../helpers/asyncHandler')

/**
 * 1. Create New Order [User]
 * 2. Query Orders [User]
 * 3. Query Order Using It's ID [User]
 * 4. Cancel Order [User]
 * 5. Update Order Status [Admin]
 */

router.route('/review').post(asyncHandler(orderController.checkoutReview))

router.route('/').post(asyncHandler(orderController.orderByUser))

// router
module.exports = router
