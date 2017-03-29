const fs = require('fs')
const path = require('path')

function getDirectories(srcpath, filter = ['.bin', '.cache']) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
    .filter(folder => !filter.includes(folder))
}

module.exports = getDirectories
