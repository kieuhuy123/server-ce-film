'use strict'

const { ReasonPhrase } = require('../config/reasonPhrases')
const { StatusCode } = require('../config/statusCode')

class SuccessResponse {
  constructor ({
    message,
    statusCode = StatusCode.OK,
    reasonPhrase = ReasonPhrase.OK,
    metadata = {}
  }) {
    this.message = !message ? reasonPhrase : message
    this.status = statusCode
    this.metadata = metadata
  }

  send (res, header = {}) {
    return res.status(this.status).json(this)
  }
}

class Ok extends SuccessResponse {
  constructor ({ message, metadata }) {
    super({
      message,
      metadata
    })
  }
}

class Created extends SuccessResponse {
  constructor ({
    options = {},
    message,
    statusCode = StatusCode.CREATED,
    reasonPhrase = ReasonPhrase.CREATED,
    metadata
  }) {
    super({
      message,
      statusCode,
      reasonPhrase,
      metadata
    })
    this.options = options
  }
}

module.exports = {
  Ok,
  Created
}
