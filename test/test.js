const log = require('../')

// log.capture()
// console.log('eh out')
// log.stopCapturing()
// console.assert(log.savedLog.length > 0, 'has saved logs')
// process.exit()

log.filter('!args,has,!alien')

const arg1 = log
.tags('args')
.text('args')
.return()

const ehoh = log
.tags('ehoh')
.text('ehoh')
.return()

const args2 = log
.tags('args')
.text('args')
.return()

const has = log
.tags('has')
.text('has')
.return()

const alien = log
.tags('alien')
.text('alien')
.return()


console.assert(arg1.silent === true, 'filtered is ignored')
console.assert(ehoh.silent !== true, 'non filtered is output')
console.assert(has.silent !== true, 'non filtered is output')
console.assert(args2.silent === true, 'filtered is ignored after logging a non-filtered')
console.assert(alien.silent === true, 'a second filtered is ignored')
console.log('all pass :-)')
