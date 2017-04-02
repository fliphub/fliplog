const log = require('../')

function highlitedWithColors() { return 'notice me' }
log.data(highlitedWithColors).tosource().highlight().echo()

log.sparkly().echo()
log.notify('woot echo!').echo()
log.notify('woot true!', true)
log.notify('woot!', 'description').echo()
log.bar().echo()
log.beep(1).echo()
// log.ora('spin baby spin').start()

log
  .bar([[0, 1], [1, 5], [2, 5], [3, 1], [4, 6]])
  .barStyles({colors: 'ascii'})
  .echo()


const points = []
for (let i = 0; i < Math.PI * 2; i += Math.PI / 1000) {
  points.push([i, Math.cos(i)])
}
log.bar(points).echo()
