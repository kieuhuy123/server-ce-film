'use strict'
const { createClient } = require('redis')
// const {
//   REDIS_CONNECT_TIMEOUT,
//   REDIS_CONNECT_MESSAGE
// } = require('../constants/common.constants')
// const { RedisErrorResponse } = require('../core/error.response')

let client = {},
  statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
  }

// let connectionTimeout

// const handleTimeoutError = () => {
//   connectionTimeout = setTimeout(() => {
//     throw new RedisErrorResponse({
//       message: REDIS_CONNECT_MESSAGE.message.vi,
//       statusCode: REDIS_CONNECT_MESSAGE.code
//     })
//   }, REDIS_CONNECT_TIMEOUT)
// }

const handleEventConnection = ({ connectionRedis }) => {
  try {
    // check if connection is null
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
      console.log('ConnectionRedis - connection success')
      //   clearTimeout(connectionTimeout)
    })
    connectionRedis.on(statusConnectRedis.END, () => {
      console.log('ConnectionRedis - connection end')
      // connect retry
      //   handleTimeoutError()
    })
    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
      console.log('ConnectionRedis - connection reconnecting')
      //   clearTimeout(connectionTimeout)
    })
    connectionRedis.on(statusConnectRedis.ERROR, error => {
      console.log('ConnectionRedis - connection error: ', error)
      // connect retry
      //   handleTimeoutError()
    })
    console.log('ConnectionRedis - connecting...', connectionRedis?.connected)
    connectionRedis.ping((err, result) => {
      if (err) {
        console.log('Error in Redis connection', err)
      }
      console.log('Redis connection success', result)
    })
    if (connectionRedis && connectionRedis.connected) {
      connectionRedis.get('key', (err, value) => {
        console.log('Error in Redis connection key', err)
      })
    } else {
      console.error('Cannot perform operation: Redis client is closed')
    }
    connectionRedis
  } catch (error) {
    console.log('Error in Redis handleEventConnection', error)
  }
}
const initRedis = () => {
  try {
    const instanceRedis = createClient()
    client.instanceConnect = instanceRedis
    handleEventConnection({ connectionRedis: instanceRedis })
  } catch (error) {
    console.log('Error in Redis initRedis', error)
  }
}

const getRedis = () => client

const closeRedis = () => {
  // client.instanceConnect.disconnect()
}

module.exports = {
  initRedis,
  getRedis,
  closeRedis
}

setTimeout(() => {
  closeRedis()
}, 3000)
