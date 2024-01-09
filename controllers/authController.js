const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
  if (!req?.body?.email || !req?.body?.password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }
  const { email, password } = req.body

  const foundUser = await User.findOne({ email }).lean().exec()
  if (!foundUser) {
    return res.sendStatus(401) //Unauthorize
  }

  const match = await bcrypt.compare(password, foundUser.password)
  if (!match) return res.status(401).json({ message: 'Unauthorized' })

  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser._id,
        email: foundUser.email,
        roles: foundUser.roles
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  )

  const refreshToken = jwt.sign(
    { email: foundUser.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  )

  // Create secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: 'None', //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
  })

  // Send accessToken containing username and roles
  res.json({ accessToken })
}

const handleLogout = (req, res) => {
  const cookies = req.cookies

  if (!cookies?.jwt) return res.sendStatus(204) //No content
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  res.json({ message: 'Cookie cleared' })
}

module.exports = { handleLogin, handleLogout }
