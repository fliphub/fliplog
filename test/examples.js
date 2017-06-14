const log = require('../')

const factoried = log.factory()

const dirMatch = new RegExp(__dirname, 'gmi')
const logger = (text, data) => {
  const clean = log
    .cleaner(true)
    .vals([dirMatch, x => typeof x === 'string'])
    .keys([dirMatch])
    .onMatch((arg, traverser) => arg.replace(dirMatch, 'funfunfun!'))
    .onNonMatch(arg => {
      // console.log({arg}, 'nonmatch')
    })
    .data({data, text})
    .clean()

  const cleaned = clean.cleaned()
  console.log(cleaned.text, cleaned.data)
}

log
  .preset('error')
  .data(new Error('prettyfull!'))
  .set('logger', logger)
  .echo()

function traceIt() {
  function stackIt() {
    function louder() {
      // require.main.filename = 'INTERNAL-TESTS/' + __filename
      const customError = new Error('prettyfull!')
      customError.stack = customError.stack.replace(/fliplog/, 'INTERNAL-TESTS')
      customError.eh = true
      customError.extraPretty = true
      Object.defineProperty(customError, 'prop', {
        configurable: true,
        enumerable: true,
        value: 'eh',
      })
      // log.set('logger', logger)

      log.preset('error').data(customError).echo()
    }
    louder()
  }
  stackIt()
}
traceIt()
process.exit()

log
  .text('\n========================================\n')
  .color('bold')
  .time(false)
  .echo()

log.text('eh').data({some: 'data'}).echo()
log.data('twoooo').verbose().echo()
log.text('text').data({some: 'data!'}).verbose().echo()
log.text('tosource').data({some: 'data!'}).tosource().echo()
log.preset('warning').data(' this message will self destruct').echo()

log.time(true).xterm(202, 236).text(' orange!!! ').echo()

log
  .text('\n========================================\n')
  .color('bold')
  .time(false)
  .echo()

log
  .color('cyan')
  .text('🕳  so deep, so colorful, so meta  🎨  ')
  .data(log)
  .verbose(10)
  .echo()
