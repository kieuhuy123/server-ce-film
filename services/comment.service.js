'use strict'

const commentModal = require('../models/comment.model')
const { convertToObjectId, unGetSelectData } = require('../utils')
const { NotFoundError } = require('../core/error.response')
const { getMovieById } = require('../models/repositories/movie.repo')
const { pushNotiToSystem } = require('./notification.service')
/*
    key feature: Comment service
    + add comment [User]
    + get a list of comments [User]
    + delete a comment [User, Admin]
*/
class CommentService {
  static createComment = async ({
    movieId,
    userId,
    userEmail,
    content,
    parentCommentId = null
  }) => {
    // check the movie exists
    const unSelect = ['__v', 'info', 'review', 'trailer', 'video']
    const movie = await getMovieById({ movieId, unSelect })

    if (!movie) throw new NotFoundError('Movie not found')

    // create comment
    const comment = new commentModal({
      comment_movie_id: movieId,
      comment_user_id: userId,
      comment_user_email: userEmail,
      comment_content: content,
      comment_parent_id: parentCommentId
    })

    let rightValue

    if (parentCommentId) {
      //reply comment
      const parentComment = await commentModal.findById(parentCommentId)
      if (!parentComment) throw new NotFoundError('parent comment not found')

      rightValue = parentComment.comment_right
      // updateMany comments

      await commentModal.updateMany(
        {
          comment_movie_id: convertToObjectId(movieId),
          comment_right: { $gte: rightValue }
        },
        {
          $inc: { comment_right: 2 }
        }
      )

      await commentModal.updateMany(
        {
          comment_movie_id: convertToObjectId(movieId),
          comment_left: { $gt: rightValue }
        },
        {
          $inc: { comment_left: 2 }
        }
      )

      // push notification to system collection
      pushNotiToSystem({
        type: 'COMMENT-001',
        receivedId: 1,
        senderId: userId,
        options: {
          user_email: userEmail
        }
      })
        .then(rs => console.log('result', rs))
        .catch(err => console.log(err))
      //
    } else {
      const maxRightValue = await commentModal.findOne(
        {
          comment_movie_id: convertToObjectId(movieId)
        },
        'comment_right',
        { sort: { comment_right: -1 } }
      )

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1
      } else {
        rightValue = 1
      }
    }

    // insert to comment
    comment.comment_left = rightValue
    comment.comment_right = rightValue + 1

    await comment.save()

    return comment
  }

  static getCommentsByParentId = async ({
    movieId,
    parentCommentId = null,
    limit = 50,
    offset = 0 //skip
  }) => {
    const select = unGetSelectData(['__v'])

    if (parentCommentId) {
      const parent = await commentModal.findById(parentCommentId)
      if (!parent) throw new NotFoundError('Not found comment for parent')

      const comments = await commentModal
        .find({
          comment_movie_id: convertToObjectId(movieId),
          // comment_parent_id: parentCommentId
          comment_left: { $gt: parent.comment_left },
          comment_right: { $lte: parent.comment_right }
        })
        .select(select)
        .sort({ comment_left: 1 })

      return comments
    }

    const comments = await commentModal
      .find({
        comment_movie_id: convertToObjectId(movieId),
        comment_parent_id: parentCommentId
      })
      .select(select)
      .sort({ comment_left: 1 })

    return comments
  }

  // delete comments
  static deleteComment = async ({ commentId, movieId }) => {
    // check the movie exists
    const unSelect = ['__v', 'info', 'review', 'trailer', 'video']
    const movie = await getMovieById({ movieId, unSelect })

    if (!movie) throw new NotFoundError('Movie not found')

    // 1.Xac dinh gia tri left and right of commentId
    const comment = await commentModal.findById(commentId)

    if (!comment) throw new NotFoundError('Comment not found')

    const leftValue = comment.comment_left
    const rightValue = comment.comment_right

    // 2.Tinh width
    const width = rightValue - leftValue + 1

    // 3.Xoa tat ca commentId con
    await commentModal.deleteMany({
      comment_movie_id: convertToObjectId(movieId),
      comment_left: { $gte: leftValue, $lte: rightValue }
    })
    // 4.Cap nhat gia tri left va right con lai
    await commentModal.updateMany(
      {
        comment_movie_id: convertToObjectId(movieId),
        comment_right: { $gt: rightValue }
      },
      { $inc: { comment_right: -width } }
    )

    await commentModal.updateMany(
      {
        comment_movie_id: convertToObjectId(movieId),
        comment_left: { $gt: rightValue }
      },
      { $inc: { comment_left: -width } }
    )

    return true
  }
}

module.exports = CommentService
