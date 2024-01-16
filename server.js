require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

const morgan = require('morgan')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const { countConnect, checkOverload } = require('./helpers/check-connect')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')

connectDB()

app.use(cors(corsOptions))
// countConnect()
// checkOverload()

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
// Routes

app.use('/', require('./routes'))
app.use('/watchlist', require('./routes/watchlistRoutes'))
app.use('/rate', require('./routes/rateRoutes'))

const server = app.listen(port, () => {
  console.log(`server run on port ${port}`)
})

// handle error
app.use((req, res, next) => {
  const error = new Error('Not Found')
  console.log('error', error)
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  console.log('statusCode', statusCode)
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
