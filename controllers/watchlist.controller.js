'use strict'

const { Created, Ok } = require('../core/success.response')

const WatchlistService = require('../services/watchlist.service')

class WatchlistController {
  addToWatchlist = async (req, res, next) => {
    new Ok({
      message: 'Add movie to watchlist OK',
      metadata: await WatchlistService.addToWatchlist(req.body)
    }).send(res)
  }

  getWatchlist = async (req, res, next) => {
    new Ok({
      message: 'Get watchlist OK',
      metadata: await WatchlistService.getWatchlist(req.query)
    }).send(res)
  }

  removeFromWatchlist = async (req, res, next) => {
    new Ok({
      message: 'Remove movie to watchlist OK',
      metadata: await WatchlistService.removeFromWatchlist(req.body)
    }).send(res)
  }
}

module.exports = new WatchlistController()
