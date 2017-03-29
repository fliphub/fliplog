const fs = require('fs')

module.exports = function isDir(file) {
  try {
    return fs.lstatSync(file).isDirectory()
  } catch (e) {
    return false
  }
}
