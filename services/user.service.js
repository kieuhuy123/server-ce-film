'use strict'
const dayjs = require('dayjs')

const User = require('../models/User')
const { getSelectData, unGetSelectData } = require('../utils')
const { packageExpired } = require('../models/package.model')
const { BadRequestError } = require('../core/error.response')

const findByEmail = async ({ email }) => {
  const select = getSelectData(['email', 'password', 'roles', 'googleId'])
  return await User.findOne({ email }).select(select).lean()
}

const findUserById = async ({ userId }) => {
  const unSelect = unGetSelectData(['__v'])

  return await User.findById(userId).select(unSelect).lean()
}

const updateUserPackage = async ({ userId, type, value_date }) => {
  const nowDate = dayjs()
  let expiredDate = nowDate.add(value_date, 'day').format('YYYY-MM-DD')
  let convertExpiredDate = dayjs(expiredDate).format()
  // let convertExpiredDate = Date.now() + 60 * 1000
  const foundUser = await findUserById({ userId })

  const { package_own, package_expired } = foundUser

  if (package_own === type) {
    expiredDate = dayjs(package_expired)
      .add(value_date, 'day')
      .format('YYYY-MM-DD')

    convertExpiredDate = dayjs(expiredDate).format()
  }

  const trackingPackageExpired = await packageExpired.create({
    user_id: userId,
    package_type: type,
    expireAt: convertExpiredDate
  })

  if (!trackingPackageExpired)
    throw new BadRequestError('create tracking package expired error')

  // Change stream subscribe to package expired, automatic update when package expired
  const changeStream = packageExpired.watch()
  let newChangeStream
  changeStream.once('change', async next => {
    if (next.operationType === 'delete') {
      const updateUser = await User.findOneAndUpdate(
        {
          _id: userId,
          convert_package_expired: { $lte: next.wallTime }
        },
        {
          package_own: '',
          package_expired: ''
        }
      )
    }
    const resumeToken = changeStream.resumeToken

    changeStream.close()

    newChangeStream = packageExpired.watch({ resumeAfter: resumeToken })
    newChangeStream.on('change', async next => {
      // process next document

      if (next.operationType === 'delete') {
        const updateUser = await User.findOneAndUpdate(
          {
            _id: userId,
            convert_package_expired: { $lte: next.wallTime }
          },
          {
            package_own: '',
            package_expired: ''
          }
        )
      }
    })
  })

  // Return user
  const filter = { _id: userId }
  const update = {
    package_own: type,
    package_expired: expiredDate,
    convert_package_expired: convertExpiredDate
  }

  return await User.findOneAndUpdate(filter, update)
}

module.exports = {
  findByEmail,
  updateUserPackage
}
