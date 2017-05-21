module.exports = {
  // deps: {
  //   'prettyjson': '1.2.1',
  // },

  prettyformat(obj) {
    const format = this.requirePkg('pretty-format')
    return this.formatter(format).data(obj)
  },
  fmtobj(obj) {
    const format = this.requirePkg('fmt-obj')
    return this.formatter(format).data(obj)
  },

  prettyjson(data = null, opts = {}) {
    const prettyjson = this.requirePkg('prettyjson') // eslint-disable-line
    if (data !== null) {
      return prettyjson.render(data, opts)
    }
    return prettyjson
  },

  /**
   * @tutorial https://github.com/fliphub/fliplog/blob/master/README.md#json
   * @param  {Object | any} data
   * @param  {Object} [opts={}]
   * @return {FlipLog} @chainable
   */
  json(data, opts = {}) {
    if (typeof data !== 'object') {
      return this.data(data).verbose(5)
    }

    const defaults = {
      keysColor: 'blue',
      dashColor: 'yellow',
      stringColor: 'italic',
      numberColor: 'green',
    }

    opts = Object.assign(defaults, opts)

    // return this.data(this.prettyjson().render(data, opts))
    return this.formatter(() => this.prettyjson().render(data, opts)).data(data)
  },
}
