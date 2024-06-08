'use strict'
const { createClient } = require('redis')

const { RedisErrorResponse } = require('../core/error.response')

const REDIS_CONNECT_TIMEOUT = 10000
const REDIS_CONNECT_MESSAGE = {
  code: -99,
  message: {
    vi: 'Redis loi roi anh em oi',
    en: 'Service connection error'
  }
}

let client = {},
  statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
  }
let connectionTimeout
const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new RedisErrorResponse({
      message: REDIS_CONNECT_MESSAGE.message.vi,
      statusCode: REDIS_CONNECT_MESSAGE.code
    })
  }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnection = async ({ connectionRedis }) => {
  try {
    // check if connection is null
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
      console.log('ConnectionRedis - connection success')
      clearTimeout(connectionTimeout)
    })
    connectionRedis.on(statusConnectRedis.END, () => {
      console.log('ConnectionRedis - connection end')
      // connect retry
      handleTimeoutError()
    })
    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
      console.log('ConnectionRedis - connection reconnecting')
      clearTimeout(connectionTimeout)
    })
    connectionRedis.on(statusConnectRedis.ERROR, error => {
      console.log('ConnectionRedis - connection error: ', error)
      // connect retry
      handleTimeoutError()
    })

    // console.log('ConnectionRedis - connecting...', connectionRedis?.connected)

    // connectionRedis.ping((err, result) => {
    //   if (err) {
    //     console.log('Error in Redis connection', err)
    //   }
    //   console.log('Redis connection success', result)
    // })

    // if (connectionRedis && connectionRedis.connected) {
    //   connectionRedis.get('key', (err, value) => {
    //     console.log('Error in Redis connection key', err)
    //   })
    // } else {
    //   console.error('Cannot perform operation: Redis client is closed')
    // }
    // connectionRedis.connect()
  } catch (error) {
    console.log('Error in Redis handleEventConnection', error)
  }
}
const initRedis = () => {
  try {
    const instanceRedis = createClient({
      password: 'lKsELIHMUsJFRK4ISdRMl0Hb0bBH3UXp',
      socket: {
        host: 'redis-15017.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com',
        port: '15017'
      }
    })

    client.instanceConnect = instanceRedis

    handleEventConnection({ connectionRedis: instanceRedis })
  } catch (error) {
    console.log('Error in Redis initRedis', error)
  }
}

const getRedis = () => client

const closeRedis = () => client.instanceConnect.disconnect()

module.exports = {
  initRedis,
  getRedis,
  closeRedis
}

// setTimeout(() => {
//   closeRedis()
// }, 3000)

// const { createClient } = require('redis')

// const client = createClient({
//   password: 'lKsELIHMUsJFRK4ISdRMl0Hb0bBH3UXp',
//   socket: {
//     host: 'redis-15017.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com',
//     port: '15017'
//   }
// })
// module.exports = { client }
