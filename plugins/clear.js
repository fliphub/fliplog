module.exports = {

  /**
   * @tutorial https://github.com/fliphub/fliplog#-clear
   * @see cli-color
   * @return {FlipLog}
   */
  clear() {
    const clc = require('cli-color')
    process.stdout.write(clc.reset)
    return this
  },
}
