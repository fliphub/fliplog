module.exports = function testingIs(is) {
  const testing = {}
  Object.keys(is).forEach((key) => {
    const fn = is[key]
    testing[key] = (arg1, arg2) => {
      if (fn(arg1, arg2)) return true
      const msg = 'when merging two chains, first call .toConfig'
      const validation = new Error(msg)
      validation.youUsed = arg1
      validation.for = key
      let log
      try {
        log = require('fliplog')
          .verbose(2)
          .data(validation)
          .preset('error')
      } catch (e) {
        log = console
      }
      log.log(validation)
      throw validation
      return this
    }
  })
  testing.all = (arg, fns = []) => fns.map((fn) => fns(arg))
  return testing
}
