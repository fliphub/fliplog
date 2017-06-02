const log = require('../')

// log
//   .ansi()
//   .buffer()
//   .bold()
//   .italic()
//   .write('eh')
//   .reset()
//   .red()
//   .write(' red')
//   .reset()
//   .write('\n')
//   .flush()

const name = 'default'
const files = `(0 files,  53 Bytes)`
const size = `2.9 kB`
const list = [`main.js`, `main.scss`]

log
  .ansi(true)
  .write(`└──`)
  .green(name)
  .yellow(`${size} files`)
  .green(`${files}`)
  .echo()

log
  .ansi(true)
  .write(`└──`)
  .red(name)
  .bold(`${size} files`)
  .write(`${files}`)
  .echo()

// log.bold('reset').fmtobj({reset: true}).echo()
