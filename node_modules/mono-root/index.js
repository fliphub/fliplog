// @example
// defaults to encoding buffer
// https://nodejs.org/api/child_process.html#child_process_child_process_execsync_command_options
// https://github.com/sindresorhus/execa#execasyncfile-arguments-options
// https://www.hacksparrow.com/difference-between-spawn-and-exec-of-node-js-child_process.html
// https://dzone.com/articles/understanding-execfile-spawn-exec-and-fork-in-node
// https://gist.github.com/s4y/1215700
// http://krasimirtsonev.com/blog/article/Nodejs-managing-child-processes-starting-stopping-exec-spawn
// https://www.npmjs.com/package/approot

function splitSlashAndPop(str) {
  // split at every folder
  str = str.split('/')

  // remove last
  str.pop()

  return str
}

function removeNodeModulesAndBin(str) {
  str = splitSlashAndPop(str)

  // remove node modules
  return str.slice(0, str.length - 1).join('/')
}

function hasPkg(dir) {
  const exists = require('flipfile/exists')
  return exists(dir + '/package.json')
}

function upDir(dir) {
  return splitSlashAndPop(dir).join('/')
}

function npmUp(currentPkgPath) {
  const {execFileSync} = require('child_process')
  return removeNodeModulesAndBin(
    execFileSync('npm', ['bin'], {
      cwd: upDir(currentPkgPath),
    }).toString())
}

function rootable(args = {depth: 4, asObj: false}) {
  const paths = {
    farthest: false,
    nearest: false,
  }

  paths.nearest = paths.farthest = require('app-root-path').toString()
  paths.farthest = paths.nearest

  if (args && args.depth !== 4 && paths.nearest.includes('mono-root')) {
    paths.nearest = process.cwd()
    paths.farthest = process.cwd()
    args.depth = 10
    paths.selved = true
  }
  if (args.depth > 1) {
    paths.attempt = paths.farthest
    paths.found = paths.found
    paths.closest = false

    // start here if failed
    if (hasPkg(paths.attempt)) {
      if (!paths.closest &&
          paths.selved &&
          paths.attempt &&
          !paths.attempt.includes('node_modules')) {
        paths.closest = paths.attempt
        paths.farthest = paths.attempt
        args.depth = 0 // do not loop
      }
      paths.found = paths.attempt
    }

    for (let i = 0; i < args.depth; i++) {
      paths.attempt = upDir(paths.attempt)
      if (hasPkg(paths.attempt)) {
        // if we have not set closed, and we failed
        if (!paths.closest &&
            paths.selved &&
            paths.attempt &&
            !paths.attempt.includes('node_modules')) {
          paths.found = paths.attempt
          break
        } else {
          paths.found = paths.attempt
        }
      }
    }
    if (paths.found) paths.farthest = paths.found
  }

  if (args.asObj) return paths
  return paths.farthest
}

module.exports = rootable
