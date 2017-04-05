const log = require('../')
log.slow(1000)
log.emoji('snail').yellow('slow...').echo()
const start = Date.now()
log.emoji('snail').yellow('...slow').echo()
const end = Date.now() - start
console.assert(end >= 1000 && end <= 1010, 'timing was 1s')
console.log('timing was 1s', end)
