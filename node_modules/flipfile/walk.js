var fs = require('fs')

module.exports = function walk(dir, options) {
  var defaults = {
    recursive: true,
  }
  options = Object.assign(defaults, options)
  var results = []
  var list = fs.readdirSync(dir)
  list.forEach(function(file) {
    file = dir + '/' + file
    var stat = fs.statSync(file)

    if (options.recursive) {
      if (stat && stat.isDirectory()) results = results.concat(walk(file))
      else results.push(file)
    } else if (stat && stat.isDirectory()) {
      results.push(file)
    }
  })
  return results
}
