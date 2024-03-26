'use strict'

const { Created, Ok } = require('../core/success.response')

const RatingService = require('../services/rating.service')

class RatingController {
  addRating = async (req, res, next) => {
    new Ok({
      message: 'Add rating OK',
      metadata: await RatingService.addRating(req.body)
    }).send(res)
  }

  getListRating = async (req, res, next) => {
    new Ok({
      message: 'get list rating OK',
      metadata: await RatingService.getListRating(req.query)
    }).send(res)
  }

  updateRating = async (req, res, next) => {
    new Ok({
      message: 'update rating OK',
      metadata: await RatingService.updateRating(req.body)
    }).send(res)
  }
}

module.exports = new RatingController()
