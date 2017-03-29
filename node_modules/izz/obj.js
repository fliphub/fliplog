module.exports = function isObject(input) {
  var type = typeof input
  return !!input && (type == 'object' || type == 'function')
}
