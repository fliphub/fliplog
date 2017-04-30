const log = require('../')

log.startCapturing()
console.log('ok')
log.stopCapturing()

console.log(log.savedLog)
console.assert(log.savedLog.length > 0)
