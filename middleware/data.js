const {basename} = require('path')
const {inspector} = require('inspector-gadget')

module.exports = {

  /**
   * @tutorial https://www.npmjs.com/package/expose-hidden
   * @param  {Boolean} [shouldExpose=true]
   * @return {FlipLog}
   */
  expose(shouldExpose = true) {
    return this.set('expose', shouldExpose)
  },

  /**
   * @private
   * @see FlipLog.tosource, FlipLog.highlight
   * @param  {any} msg
   * @return {string}
   */
  getToSource(msg) {
    const highlighter = this.get('highlighter')

    // typeof msg === 'object' &&
    if (this.has('tosource') === true) {
      const tosource = require('tosource')
      if (highlighter) return highlighter(tosource(msg))
      return tosource(msg)
    }

    if (highlighter) return highlighter(msg)

    return msg
  },

  /**
   * @private
   * @see FlipLog.verbose, FlipLog.highlight
   * @param  {any} msg
   * @return {any}
   */
  getVerbose(msg) {
    if (this.has('verbose') === true && typeof msg !== 'string') {
      const PrettyError = require('pretty-error')
      let error = false
      if (msg && msg.stack) {
        const pe = new PrettyError()
        error = console.log(pe.render(msg))
        delete msg.stack
        try {
          const message = msg.message.split('\n')
          msg.message = message
        } catch (e) {
          // do nothing, likely logging a trace
        }
      }

      msg = inspector(msg, this.get('verbose'))
    }

    return msg
  },
}
