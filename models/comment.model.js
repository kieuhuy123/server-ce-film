'use strict'

const mongoose = require('mongoose')
const { Schema } = mongoose

const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'Comments'

const commentSchema = new Schema(
  {
    comment_movie_id: { type: Schema.Types.ObjectId, ref: 'Movie' },
    comment_user_id: { type: Number, default: 1 },
    comment_content: { type: String, default: 'text' },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parent_id: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
    is_deleted: { type: Boolean, default: false }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

module.exports = mongoose.model(DOCUMENT_NAME, commentSchema)
