module.exports = {
  deps: {
    'prettyjson': '1.2.1',
  },
  
  prettyjson() {
    return require('prettyjson')
  },

  json(data, opts = {}) {
    if (typeof data !== 'object') return this.data(data).verbose(5)
    const defaults = {
      keysColor: 'blue',
      dashColor: 'yellow',
      stringColor: 'italic',
      numberColor: 'green',
    }
    opts = Object.assign(defaults, opts)

    const prettyjson = require('prettyjson')
    const prettified = prettyjson.render(data, opts)
    return this.data(prettified)
  },
}
