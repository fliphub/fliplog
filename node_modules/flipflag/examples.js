const timer = require('fliptime')
const flags = require('./')

timer.start('calling flags')

const envs = flags('--env')
const found = flags('nonExistantForAllCases')

timer.stop('calling flags').log('calling flags')
timer.logLaps('flagger')
console.log(envs, found)
