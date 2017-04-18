/**
 * @tutorial https://github.com/fliphub/fliplog#-slow
 */
module.exports = {
  // ----------------------------- sleeping ------------------
  deps: {
    'sleepfor': '*',
  },

  reset() {
    this.delete('sleepBetween')
  },

  /**
   * @param {Number} [args=false]
   * @return {Function} sleepfor
   */
  sleepfor(args = false) {
    const sleepfor = require('sleepfor')

    if (args !== false) sleepfor(args)

    return sleepfor
  },

  /**
   * @param  {Number} [time=1000]
   * @return {FlipLog}
   */
  sleep(time = 1000) {
    this.sleepfor(time)
    return this
  },

  /**
   * @param  {Number} [time=100]
   * @return {FlipLog}
   */
  slow(time = 100) {
    return this.set('sleepBetween', time)
  },

  /**
   * @TODO: middleware...
   * @see FlipLog.slow
   * @return {FlipLog}
   */
  sleepIfNeeded() {
    if (this.has('sleepBetween')) {
      this.sleepfor(this.get('sleepBetween'))
    }

    return this
  },
}
