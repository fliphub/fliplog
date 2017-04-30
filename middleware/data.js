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
   * @protected
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
   * @protected
   * @see FlipLog.verbose, FlipLog.highlight
   * @param  {string | any} msg
   * @return {string | any}
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
          return msg
        }
        catch (e) {
          // do nothing, likely logging a trace
        }
      }

      // console.log({msg})
      msg = inspector(msg, this.get('verbose'))
    }

    return msg
  },
}
