module.exports = {
  deps: {
    'fliptime': '*',
  },

  // ----------------------------- timer ------------------

  startTimer(name) {
    const fliptime = require('fliptime')
    fliptime.start(name)
    return this
  },
  stopTimer(name) {
    const fliptime = require('fliptime')
    fliptime.stop(name)
    return this
  },
  lapTimer(name) {
    const fliptime = require('fliptime')
    fliptime.lap(name)
    return this
  },
  fliptime(name) {
    const fliptime = require('fliptime')
    return fliptime
  },
  echoTimer(name) {
    const fliptime = require('fliptime')
    fliptime.log(name)
    return this
  },
  stopAndEchoTimer(name) {
    const fliptime = require('fliptime')
    fliptime.stop(name).log(name)
    return this
  },
}
