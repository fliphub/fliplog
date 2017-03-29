module.exports = function isSet(input) {
  if (typeof Set === 'undefined') {
    return false
  }
  return input instanceof Set
}
