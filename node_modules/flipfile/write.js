const fs = require('fs')
const mkdirp = require('mkdirp')

function write(dir, contents, helpers) {
  // get the final dir excluding the file
  let finalOutputDir = dir.split('/')
  finalOutputDir.pop()
  finalOutputDir = finalOutputDir.join('/')

  // make the final dir if it does not exist
  if (!fs.existsSync(finalOutputDir)) mkdirp.sync(finalOutputDir)

  // dir = helpers.resolve(dir)
  return fs.writeFileSync(dir, contents, 'utf8')
}

module.exports = write
