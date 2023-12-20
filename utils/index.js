// ['a', 'b'] = {a: 0, b: 0}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}

// ['a', 'b'] = {a: 0, b: 0}
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]))
}

module.exports = {
  getSelectData,
  unGetSelectData
}
