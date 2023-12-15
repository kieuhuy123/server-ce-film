const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
  'https://server-ce-film.onrender.com/'
]

const corsOptions = {
  origin: (origin, callback) => {
    console.log(allowedOrigins.indexOf(origin))
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}

module.exports = corsOptions
