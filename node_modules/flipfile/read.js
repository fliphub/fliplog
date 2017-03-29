const fs = require('fs')

// http://stackabuse.com/read-files-with-node-js/
function read(dir) {
  try {
    // if (!dir) warn
    // isAbsolute(dir)
    // var resolved = helpers.resolve(dir)
  } catch (e) {

  }
  return fs.readFileSync(dir, 'utf8')
}

function tryJSON(json) {
  try {
    const parsed = JSON.parse(json)
    return parsed
  } catch (e) {
    return false
  }
}

function readJSON(dir) {
  return tryJSON(read(dir))
}

read.json = readJSON

module.exports = read
