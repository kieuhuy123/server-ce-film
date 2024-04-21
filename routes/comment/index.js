'use strict'

const express = require('express')
const router = express.Router()
const commentController = require('../../controllers/comment.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../middleware/checkAuth')

router
  .route('/')
  .post(authenticationV2, asyncHandler(commentController.createComment))
  .get(asyncHandler(commentController.getCommentsByParentId))
  .delete(authenticationV2, asyncHandler(commentController.deleteComment))

module.exports = router
