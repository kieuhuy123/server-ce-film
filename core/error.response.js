'use strict'

const { ReasonPhrase } = require('../config/reasonPhrases')
const { StatusCode } = require('../config/statusCode')

class ErrorResponse extends Error {
  constructor (message, status) {
    super(message)
    this.status = status
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor (
    message = ReasonPhrase.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse {
  constructor (
    message = ReasonPhrase.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode)
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError
}
