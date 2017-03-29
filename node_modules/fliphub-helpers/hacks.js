// lib.log(data, {color: 'bgRed.black', level: ' 🤦  badLog ', time: false, verbose: true})
const timer = require('./timer')
const {inspectorGadget, inspector} = require('./inspect')

global._timer = timer
global.inspector = inspector
global.inspectorGadget = inspectorGadget
