const log = require('../')

log
  .addSpinner('key1', 'spinner 1 msg')

log.addSpinner('key2', 'spinner 2 msg')

log.addSpinner('key3', 'spinner 3 msg')

log.text('meh').echo()

// log.quick(log.spinnerOpts, log.spinners)

// arg is optionally a string for frames
// or an object for multi-spinner options
log.startSpinners()

// string arg removes by name
setTimeout(() => log.removeSpinner('key1'), 1000)

// empty args removes all
setTimeout(() => log.removeSpinner(), 20000)
