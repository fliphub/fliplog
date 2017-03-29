const isFile = require('./isFile')
const isDir = require('./isDir')

module.exports = function isFileOrDir(file) {
  return typeof file === 'string' && (isDir(file) || isFile(file))
}
