const funcTag = '[object Function]'
const funcTag2 = '[Function]'
const genTag = '[object GeneratorFunction]'
const objectProto = Object.prototype
const objectToString = objectProto.toString
const isObject = require('./obj')

module.exports = function isFunction(value) {
  var tag = isObject(value) ? objectToString.call(value) : ''
  return tag === funcTag2 || tag == funcTag || tag == genTag
}
