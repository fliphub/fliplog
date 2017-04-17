module.exports = {
  deps: {
    'javascript-stringify': '1.6.0',
  },

  /**
   * @tutorial https://github.com/fliphub/fliplog#-stringifying
   * @param  {any} data
   * @param  {any} [replacer=null]
   * @param  {String} [spacer='  ']
   * @param  {any} [options=null] javascript-stringify options
   * @return {FlipLog}
   */
  stringify(data, replacer = null, spacer = '  ', options = null) {
    const stringify = require('javascript-stringify')
    const prettified = stringify(data, replacer, spacer, options)
    return this.data(prettified)
  },
}
