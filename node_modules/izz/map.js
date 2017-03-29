module.exports = function isMap(input) {
  if (typeof Map === 'undefined') {
    return false
  }
  return input instanceof Map
}
