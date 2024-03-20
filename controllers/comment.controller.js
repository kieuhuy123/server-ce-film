'use strict'

const { Created, Ok } = require('../core/success.response')
const {
  createComment,
  getCommentsByParentId,
  deleteComment
} = require('../services/comment.service')

class CommentController {
  createComment = async (req, res, next) => {
    new Ok({
      message: 'Create new comment success',
      metadata: await createComment(req.body)
    }).send(res)
  }

  getCommentsByParentId = async (req, res, next) => {
    new Ok({
      message: 'Get comments success',
      metadata: await getCommentsByParentId(req.query)
    }).send(res)
  }

  deleteComment = async (req, res, next) => {
    new Ok({
      message: 'Delete comment success',
      metadata: await deleteComment(req.query)
    }).send(res)
  }
}

module.exports = new CommentController()
