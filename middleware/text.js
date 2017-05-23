const {combinations} = require('../deps')

module.exports = {

  /**
   * @desc decorate fliplog with color shorthands
   * @return {void}
   */
  init() {
    combinations.forEach(color => {
      this[color] = text => {
        return this.color(color).text(text)
      }
    })
  },

  /**
   * @protected
   * @param {string} [msg='']
   * @return {string}
   */
  logSpaces(msg = '') {
    if (this.has('space') === false) return msg

    const space = this.get('space')
    if (Number.isInteger(space)) return '\n'.repeat(space)
    if (space === true) return '\n\n\n'
    // else if (space !== undefined) console.log('\n')

    return msg || ''
  },

  /**
   * @protected
   * @param {string} [msg]
   * @return {string}
   */
  getColored(msg) {
    const logWrapFn = this.getLogWrapFn()

    if (this.get('text')) return `${logWrapFn(msg)}`
    let text = logWrapFn(this.get('text'))
    if (text) text += ':'

    return text
  },

  /**
   * with null parameter,
   * this allows using this fn
   * without setting color for the whole text
   *
   * @see FlipLog.addText
   *
   * @protected
   * @param {string | function} [color=null]
   * @return {Function}
   */
  getLogWrapFn(color = null) {
    // deps
    const chalk = this.requirePkg('chalk')
    let logWrapFn = chalk

    // variable
    if (color === null) {
      color = this.get('color')
    }

    // maybe we colored with something not in chalk, like xterm
    if (typeof color === 'function') {
      logWrapFn = color
    }

    // if there is no color, empty fn call
    else if (color === false || this.has('color') === false) {
      logWrapFn = msg => msg
    }

    // dot-prop access to chalk or xterm
    else if (color.includes('.')) {
      color.split('.').forEach(clr => logWrapFn = logWrapFn[clr])
    }

    // when in all combinations, then call the corresponding fn
    else if (combinations.includes(color)) {
      logWrapFn = logWrapFn[color]
    }

    // fallback style
    // otherwise if the fn has a method with the name of the color
    else if (logWrapFn[color]) {
      logWrapFn = logWrapFn[color]
    }

    // otherwise just use whatever was passed in
    return logWrapFn
  },

  /**
   * @desc when time is used, prepends timestamp to msg
   * @param  {string} msg
   * @return {string} returns msg with timestamp if needed
   */
  getTime(msg) {
    if (this.has('time') === true && this.get('time') === true) {
      const chalk = this.requirePkg('chalk')

      const data = new Date()

      let hour = data.getHours()
      let min = data.getMinutes()
      let sec = data.getSeconds()
      let ms = data.getMilliseconds()

      hour = hour < 10 ? `0${hour}` : hour
      min = min < 10 ? `0${min}` : min
      sec = sec < 10 ? `0${sec}` : sec
      ms = ms < 10 ? `0${sec}` : ms

      return chalk.yellow(`${min}:${sec}:${ms}: `) + msg
    }

    return msg
  },
}
