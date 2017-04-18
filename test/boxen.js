const log = require('../')

log.bold().box('fliplog').echo()

// log.quick(log.box('fliplog').color('bold').returnVals())

// log.bold().box('fliplog').echo()

// log.box('fliplog', true)
log
  .boxStyles({borderColor: 'blue'})
  .box('fliplog')
  .echo()

// console.log(values)

// const boxen = require('boxen')
// console.log(boxen('fliplog', {padding: 1, margin: 1, borderStyle: 'double', borderColor: 'blue'}))
