const log = require('../')

// log.stats = {
//   process: process.memoryUsage(),
//   os: require('os').freemem(),
//   version: process....
//   flags...
// }

log.filter('>= 1')
log.level(1).blue('above 1... success').echo()
log.level(0).red('not above 1...').echo()

const log2 = log.factory()

log.filter(['canada*'])
log.tag('canada-eh').white('canadian, pass.').echo()

log.filter(['eh*', '!warm', tag => (/ez/).test(tag)])
log.tag('eh').underline('eh').echo()
log.tag('warm').red('warm').echo()
log.tag('ez').yellow('ez').echo()
// log.filter([0, 1, 2, 'matcher:*'])


// log.namespace()
// log.namespaces({
//   0: '> 0',
//   1: 'silent',
//   2: 'silent',
// })

// log.filter({
//   namespace... '> 0'
// })
// log.lvl(1)
// log.tag(0)
