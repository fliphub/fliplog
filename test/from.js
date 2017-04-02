const log = require('../')

// console.log(log)
// log('???function...').echo()

// log.trace()
// log.verbose(5).data({eh: true}).echo()
// log('eh!')

log.from({
  data: 'data',
  text: 'eh',
  color: 'bold',
  echo: true,
})
