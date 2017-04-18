module.exports = {
  formatter(cb) {
    if (!cb)
      cb = arg => {
        if (arg && typeof arg === 'object') {
          Object.keys(arg).forEach(key => {
            if (typeof arg[key] === 'string') {
              arg[key] = arg[key].replace('', '')
            } else if (Array.isArray(arg[key])) {
              arg[key] = arg[key].map(a => cb(a))
            }
          })
        }
        return arg
      }

    this.set('formatter', cb)
    return this
  },
}
