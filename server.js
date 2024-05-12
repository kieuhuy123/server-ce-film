require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const { countConnect, checkOverload } = require('./helpers/check-connect')
const { v4: uuidv4 } = require('uuid')
const corsOptions = require('./config/corsOptions')
// const connectDB = require('./dbs/init.mongodb')
const myLoggerLog = require('./logger/myLogger.log')

// test pub/sub redis

// const redis = require('redis')
// const client = redis.createClient()

// require('./tests/inventory.test')
// const productTest = require('./tests/product.test')
// productTest.purchaseProduct('product:001', 10)

// init db
require('./dbs/init.mongodb')
// countConnect()
// checkOverload()

app.use(cors(corsOptions))

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(compression())

// Logs
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id']
  req.requestId = requestId ? requestId : uuidv4()
  myLoggerLog.log(`input params ::${req.method}`, [
    req.path,
    { requestId: req.requestId },
    req.method === 'POST' ? req.body : req.query
  ])

  next()
})
// init Routes

app.use('/', require('./routes'))

const server = app.listen(port, () => {
  console.log(`server run on port ${port}`)
})

// handle error
app.use((req, res, next) => {
  const error = new Error('Not Found')

  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500

  const resMessage = `${error.status} - ${
    Date.now() - error.now
  }ms - Response: ${JSON.stringify(error)}`

  myLoggerLog.error(resMessage, [
    req.path,
    { requestId: req.requestId },
    { message: error.message }
  ])

  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error'
  })
})

// run server
process.on('SIGINT', () => {
  server.close(() => console.log('Exit Server Express'))
  // notify.send(ping...)
})
