const User = require('../models/User')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

const createNewUser = async (req, res) => {
  if (!req?.body?.email || !req?.body?.password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }
  const { email, password } = req.body
  //   check for duplicate usernames in the db
  const duplicate = await User.findOne({ email: email }).lean()
  if (duplicate) {
    return res.status(409).json({ message: 'Email address already in use' })
  }

  try {
    // encrypt the password
    const hashPwd = await bcrypt.hash(password, saltRounds)
    // create and store new user
    const result = await User.create({
      email: email,
      password: hashPwd
    })

    const accessToken = jwt.sign(
      {
        email: result.email,
        id: result._id
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      {
        UserInfo: {
          email: result.email,
          roles: result.roles
        }
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    )

    res.cookie('jwt', refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: 'None', //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    res.status(201).json({ accessToken })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createNewUser }
