const log = require('../')

// examples
log.preset('error').data(new Error('prettyfull!')).echo()

log
.text('\n========================================\n')
.color('bold').time(false).echo()

log.text('eh').data({some: 'data'}).echo()
log.data('twoooo').verbose().echo()
log.text('text').data({some: 'data!'}).verbose().echo()
log.text('tosource').data({some: 'data!'}).tosource().echo()
log.preset('warning').data(' this message will self destruct').echo()

log.time(true).xterm(202, 236).text(' orange!!! ').echo()


log
.text('\n========================================\n')
.color('bold').time(false).echo()

log
  .color('cyan')
  .text('🕳  so deep, so colorful, so meta  🎨  ')
  .data(log)
  .verbose(10)
  .echo()
