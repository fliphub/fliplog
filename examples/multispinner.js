const log = require('../')

log
  .addSpinner('key2', 'spinner 2 msg')
  .addSpinner('key3', 'spinner 3 msg')
  .startSpinners()
