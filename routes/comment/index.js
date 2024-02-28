'use strict'

const express = require('express')
const router = express.Router()
const commentController = require('../../controllers/comment.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')

router
  .route('/')
  .post(asyncHandler(commentController.createComment))
  .get(asyncHandler(commentController.getCommentsByParentId))
  .delete(asyncHandler(commentController.deleteComment))

module.exports = router
