const fs = require('fs')

// is dir?
// @return boolean
// function isFile(file) {
//   if (file && file.includes('/')) {
//     return false
//   }
//   if (file.includes('.'))
//     return true
//   return false
// }
//
// https://nodejs.org/docs/latest/api/fs.html#fs_class_fs_stats
// isSocket
module.exports = function isFile(file) {
  try {
    const result = fs.lstatSync(file).isFile()
    return result
  } catch (e) {
    return false
  }
}
