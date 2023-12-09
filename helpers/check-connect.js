'use strict'

const mongoose = require('mongoose')
const os = require('os')
const SECONDS = 5000
const countConnect = () => {
  const numConnection = mongoose.connection.base.connections.length
}
// check over load
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connection.base.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss

    // Example maximum number of connections based on number of cores
    const maxConnections = numCores * 5

    console.log(`Active connections: ${numConnection}`)
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`)
    if (numConnection > maxConnections) {
      console.log(`Connection overload detected`)
    }
  }, SECONDS)
}
module.exports = { countConnect, checkOverload }
