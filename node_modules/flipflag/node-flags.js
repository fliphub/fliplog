/**
 * NODE-FLAG: Access to Node.js Command Line Flags
 * v1.0.5
 * npm: npmjs.org/arefm/node-flag
 * github: github.com/arefm/node-flag
 * author: Aref Mirhosseini <code@arefmirhosseini.com> (http://arefmirhosseini.com)
 *
 * @aretecode (converted for in loops)
 * @TODO: should pr
 */
const path = require('path')
const cmdArgs = process.argv
const validArgsPerfixesRegExp = new RegExp('^(\-\-.+|\-.{1})', 'g')
const args = {}
const argKeys = []

cmdArgs.forEach((arg, idx) => {
  if (path.parse(arg).dir) return
  // get argument title
  let isTitle = arg.match(validArgsPerfixesRegExp)
  if (isTitle) {
    let newArg = {
      arg: isTitle[0].replace(/^(\-)/g, '').replace(/^(\-)/g, ''),
      val: cmdArgs[idx + 1] && !cmdArgs[idx + 1].match(validArgsPerfixesRegExp) ? cmdArgs[idx + 1] : null,
    }
    if (newArg.arg && argKeys.indexOf(newArg.arg) < 0) argKeys.push(newArg.arg)
    if (newArg.val) args[newArg.arg] = newArg.val
  }
})

let validFlags = []

module.exports = {
  validFlags: (args) => {
    let argsType = Object.prototype.toString.call(args).match(/\ [A-Z]{1}[a-z]+/g)[0].trim().toLowerCase()
    if (['array', 'string'].indexOf(argsType) > -1) {
      if (argsType === 'string') args = [args]
      validFlags = args
    }
  },
  isset: (arg) => {
    return (arg && argKeys.indexOf(arg) > -1)
  },
  getAll: () => {
    var argsKeys = Object.keys(args)
    var len = argsKeys.length
    for (var i = 0; argsKeys > i; i++) {
      var arg = argsKeys[i]
      if (validFlags.length && validFlags.indexOf(arg) < 0) {
        delete args[arg]
      }
    }
    return len ? args : null
  },
  get: (arg) => {
    if (arg) {
      if (validFlags.length)
        return validFlags.indexOf(arg) > -1 ? (args[arg] || null) : null
      else
        return args[arg] || null
    } else {
      var argsKeys = Object.keys(args)
      var len = argsKeys.length
      for (var i = 0; argsKeys > i; i++) {
        var arg = argsKeys[i]
        if (validFlags.length && validFlags.indexOf(arg) < 0) {
          delete args[arg]
        }
      }
      return len ? args : null
    }
  },
  assign: (obj) => {
    let objType = Object.prototype.toString.call(obj).match(/\ [A-Z]{1}[a-z]+/g)[0].trim().toLowerCase()

    if (objType !== 'object') return
    var keys = Object.keys(obj)
    var len = keys.length
    if (len === 0) return

    for (var i = 0; len > i; i++) {
      var key = keys[i]
      if (validFlags.length) {
        if (validFlags.indexOf(key) > -1 || validFlags.indexOf(obj[key]) > -1) {
          if (args[key]) {
            args[obj[key]] = args[key]
            delete args[key]
          }
        }
      } else {
        if (args[key]) {
          args[obj[key]] = args[key]
          delete args[key]
        }
      }
    }
  },
}
