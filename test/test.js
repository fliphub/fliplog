const log = require('../')

// log.capture()
// console.log('eh out')
// log.stopCapturing()
// console.assert(log.savedLog.length > 0, 'has saved logs')
// process.exit()

// log.filter('!args,!alien,has')
// log.filter(['ehoh,!args,!alien,has'])

// @NOTE: to avoid overhead of cloning,
// these do have ref to each other so assertions needed to be earlier
function testLog(_log) {
  const arg1 = _log
  .tags('args')
  .text('args')
  .return()
  .silent

  console.log({arg1})
  const ehoh = _log
  .tags('ehoh')
  .text('ehoh')
  .return()
  .silent
  console.log({ehoh})

  const args2 = _log
  .tags('args')
  .text('args')
  .return()
  .silent
  console.log({args2})
  const has = _log
  .tags('has')
  .text('has')
  .return()
  .silent
  console.log(has)
  const alien = _log
  .tags('alien')
  .text('alien')
  .return()
  .silent
  console.log(alien)

  console.assert(arg1 === true, 'filtered is ignored')
  console.assert(ehoh !== true, 'non filtered is output')
  console.assert(has !== true, 'non filtered is output')
  console.assert(args2 === true, 'filtered is ignored after logging a non-filtered')
  console.assert(alien === true, 'a second filtered is ignored')
  console.log('all pass :-)')
}

const log1 = log.factory()
const log2 = log.factory()
log1.filter('!args,!alien,has')
log2.filter(['!args', 'has', '!alien', 'ehoh'])

testLog(log1)
testLog(log2)
