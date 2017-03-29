const is = require('./is')

class Utils {
  // overArg
  static overArg(func, transform) {
    return function(arg) {
      return func(transform(arg))
    }
  }

  // Flatten argumetns
  // flatten('a', 'b', ['c']) -> ['a', 'b', 'c']
  static flatten(data) {
    return [].concat.apply([], data)
  }

  // sets hidden property
  static setHiddenProperty(obj = Object, key = String, value = Object) {
    Object.defineProperty(obj, key, {
      enumerable: false,
      value,
    })
    return value
  }

  // gets parameter names
  static getParameterNamesFromFunction(func) {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
    var ARGUMENT_NAMES = /([^\s,]+)/g
    var fnStr = func.toString().replace(STRIP_COMMENTS, '')
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
    if (result === null)
      result = []
    return result
  }
}

Utils.is = is

module.exports = Utils
