const _ = require('lodash')
const { Types } = require('mongoose')

const getInfoData = ({ paths = [], object = {} }) => {
  return _.pick(object, paths)
}

// ['a', 'b'] = {a: 1, b: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}

// ['a', 'b'] = {a: 0, b: 0}
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]))
}

const convertToObjectId = id => {
  return new Types.ObjectId(id)
}

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  convertToObjectId
}
