'use strict'

const mongoose = require('mongoose')
const { Schema } = mongoose

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

// COMMENT-001: NEW comment
// MOVIE-001: New movie
const notificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      enum: ['MOVIE-001', 'COMMENT-001'],
      required: true
    },
    noti_senderId: { type: Schema.Types.ObjectId, required: true },
    noti_receivedId: { type: Number, required: true },
    noti_content: { type: String, required: true },
    noti_options: { type: Object, default: {} }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

module.exports = mongoose.model(DOCUMENT_NAME, notificationSchema)
