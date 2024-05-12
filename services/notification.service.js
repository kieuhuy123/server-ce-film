'use strict'

const {
  BadRequestError,
  ConflictRequestError
} = require('../core/error.response')
const notificationSchema = require('../models/notification.model')

const pushNotiToSystem = async ({
  type = 'COMMENT-001',
  receivedId = 1,
  senderId = 1,
  options = {}
}) => {
  let noti_content

  if (type === 'COMMENT-001') {
    noti_content = `@@@ vua moi them mot comment`
  } else if (type === 'MOVIE-001') {
    noti_content = `@@@ vua moi them mot movie`
  }

  const newNotification = await notificationSchema.create({
    noti_type: type,
    noti_content,
    noti_senderId: senderId,
    noti_receivedId: receivedId,
    noti_options: options
  })

  return newNotification
}

const listNotiByUser = async ({ userId = 1, type = 'ALL', isRead = 0 }) => {
  const match = {
    noti_receivedId: userId
  }

  if (type !== 'ALL') {
    match['noti_type'] = type
  }

  return await notificationSchema.aggregate([
    {
      $match: match
    },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_receivedId: 1,
        noti_content: 1,
        createAt: 1,
        noti_options: 1
      }
    }
  ])
}

module.exports = {
  pushNotiToSystem,
  listNotiByUser
}
