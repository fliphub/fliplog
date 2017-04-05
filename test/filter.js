const log = require('../')

// log.capture()
// console.log('eh out')
// log.stopCapturing()
// console.assert(log.savedLog.length > 0, 'has saved logs')
// process.exit()

// - means no
// + means yes: always
// # for priority?
//
//
// blank means yes, unless another tag overrides?
// but that is silly since it is default

log
  .filter((args) => {
    console.log(args)
  })

const arg1 = log
.tags('args,canada')
.text('args')
.return()

// console.log(arg1)
