'use strict'

const { Created, Ok } = require('../core/success.response')
const { listNotiByUser } = require('../services/notification.service')

class NotificationController {
  listNotiByUser = async (req, res, next) => {
    new Ok({
      message: 'Get list Notification by user OK',
      metadata: await listNotiByUser(req.query)
    }).send(res)
  }
}

module.exports = new NotificationController()
