require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const { countConnect, checkOverload } = require('./helpers/check-connect')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')

connectDB()

app.use(cors(corsOptions))
// countConnect()
// checkOverload()

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// Routes
app.get('/', (req, res) => {
  const strCompress = 'Hello world'

  return res.status(200).json({
    message: 'Hello world',
    metadata: strCompress.repeat(100000)
  })
})
app.use('/user', require('./routes/userRoutes'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/movie', require('./routes/movieRoutes'))
app.use('/watchlist', require('./routes/watchlistRoutes'))
app.use('/rate', require('./routes/rateRoutes'))

const server = app.listen(port, () => {
  console.log(`server run on port ${port}`)
})

// handle error

// run server
process.on('SIGINT', () => {
  server.close(() => console.log('Exit Server Express'))
  // notify.send(ping...)
})
