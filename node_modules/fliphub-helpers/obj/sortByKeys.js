const _sortBy = require('lodash.sortby')

function sortByKeys(obj, orderFirst) {
  const orderedObj = {}
  orderFirst = orderFirst.reverse()
  const keys = Object.keys(obj)
  _sortBy(keys, key => orderFirst.indexOf(key))
    .reverse()
    .forEach(key => {
      orderedObj[key] = obj[key]
    })
  return orderedObj
}

module.exports = sortByKeys
