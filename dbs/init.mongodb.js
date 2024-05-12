const mongoose = require('mongoose')
const { countConnect, checkOverload } = require('../helpers/check-connect')

const connectString = process.env.DATABASE_URI
const MAX_POLL_SIZE = 50
const TIME_OUT_CONNECT = 3000

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.DATABASE_URI, { maxPoolSize: 10 })
//     console.log('connectDB')
//   } catch (error) {
//     console.log(error)
//   }
// }

class Database {
  constructor () {
    this.connect()
  }

  // connect
  connect (type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    mongoose
      .connect(connectString, {
        serverSelectionTimeoutMS: TIME_OUT_CONNECT,
        maxPoolSize: MAX_POLL_SIZE
      })
      .then(_ => {
        try {
          countConnect()
        } catch (e) {
          console.log(e)
        }
        _ => console.log(`Connected mongodb success `)
      })
      .catch(err => console.log(`Error connect!`))

    mongoose.connection.on('connected', () => {
      console.log('Mongodb connected to db success')

      // insert sql ...
    })
    mongoose.connection.on('error', err => {
      console.error('Mongodb connected to db error' + err)
    })
    mongoose.connection.on('disconnected', () => {
      console.log('Mongodb disconnected db success')
    })
  }

  static getInstance () {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongoDb = Database.getInstance()
module.exports = instanceMongoDb
