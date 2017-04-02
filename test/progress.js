const log = require('../')

log.progress()
// log.progress(20, (bar, interval) => {
//   bar.tick()
//   if (bar.complete) clearInterval(interval)
// }, 1000)
// log.boxen().echo()

let contentLength = 128 * 1024
const bar = log.progress('  downloading [:bar] :percent :etas', {
  complete: '=',
  incomplete: ' ',
  width: 20,
  total: contentLength,
}).progressBar

function next() {
  if (!contentLength) return
  bar.tick(Math.random() * 10 * 1024)
  if (!bar.complete) setTimeout(next, Math.random() * 1000)
}
next()
