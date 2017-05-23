const {inspector} = require('../modules/inspector-gadget')
const {OFF} = require('../deps')

module.exports = {
  /**
   * @protected
   * @TODO should be formatters
   * @see FlipLog.tosource, FlipLog.highlight
   * @param  {any} msg
   * @return {string}
   */
  getToSource(msg) {
    const highlighter = this.get('highlighter')

    // typeof msg === 'object' &&
    if (this.has('tosource') === true) {
      const tosource = this.requirePkg('tosource')
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
    if (msg === OFF) return msg

    if (this.has('verbose') === true && typeof msg !== 'string') {
      const PrettyError = this.requirePkg('pretty-error')
      if (!PrettyError) {
        return inspector(msg, this.get('verbose'))
      }

      let error = false
      if (msg && msg.stack && msg.message && msg instanceof Error) {
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
