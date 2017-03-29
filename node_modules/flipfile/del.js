const fs = require('fs')

module.exports = function clean(file) {
  try {
    fs.unlinkSync(file)
  } catch (e) {
    // ignore
    return false
  }
  return true
}
