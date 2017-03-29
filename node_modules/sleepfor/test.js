const sleepfor = require('./')
const start = Date.now()
sleepfor(1000)
const end = Date.now() - start
console.assert(end >= 1000 && end <= 1010, 'timing was 1s')
console.log('timing was 1s', end)
