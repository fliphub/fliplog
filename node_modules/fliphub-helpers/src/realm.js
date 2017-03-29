const utils = require('realm-utils')
const realm = require('realm-js')

const exportee = Object.assign({
  realm,
}, utils)

module.exports = exportee
