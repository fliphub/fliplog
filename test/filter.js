const log = require('../')
// const log = require('../test/_old')

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
    console.log('---\n')
  })

const arg1 = log
.tags('args,canada')
.text('args')
.return()

const arg2 = log
.tags('me')
.text('me')
.return()
// .echo()

// console.log(arg1, arg2)
