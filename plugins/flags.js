// const toarr = require('chain-able/deps/to-arr')

let fwf

module.exports = {
  reset() {
    if (!fwf) fwf = require('../modules/funwithflags')

    const argv = fwf(process.argv.slice(2), {
      number: ['DEBUG_DEPTH'],
      boolean: ['DEBUG_SHOW_HIDDEN', 'DEBUG_COLORS'],
      string: ['fliplog', 'DEBUG'],
      alias: {
        fliplog: ['flipdebug'],
      },
      default: {
        DEBUG: false,
        DEBUG_DEPTH: 30,
        DEBUG_SHOW_HIDDEN: true,
        DEBUG_COLORS: true,
      },
    })

    const {DEBUG_DEPTH, DEBUG_SHOW_HIDDEN, DEBUG_COLORS, DEBUG} = argv

    if (DEBUG_COLORS === false) {
      this.strip()
    }

    this.set('argv.inspector', {
      depth: DEBUG_DEPTH,
      maxArrayLength: DEBUG_DEPTH,
      showHidden: DEBUG_SHOW_HIDDEN,
      showProxy: true,
      colors: DEBUG_COLORS,
    })

    if (DEBUG) {
      this.delete('filter')
      this.filter(DEBUG)
    }
    // @TODO: filters
    // if (DEBUG) {
    //   this.set('filter', DEBUG)
    // }

    return this
  },
}
