const firstToUpper = require('./firstToUpper')
function removePrefix(string, prefix) {
  if (string.indexOf(prefix) === 0) {
    string = string.slice(prefix.length)
  }
  return string.charAt(0).toLowerCase() + string.slice(1)
}
function addPrefix(string, prefix) {
  return prefix + firstToUpper(string)
}

module.exports = {
  firstToUpper,
  removePrefix,
  addPrefix,
}
