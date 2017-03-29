const log = require('./log')
const Aliaser = require('./alias')
const flags = require('./flags')
const resolve = require('./resolve')
const port = require('./port')
const file = require('./file')
const deepReplace = require('./deepReplace')
const inspect = require('./inspect')
const timer = require('./timer')
const arrToObj = require('./arrToObj')
const toArr = require('./toArr')
// const arr = require('./arr')
// const obj = require('./obj')
// const err = require('./err')

module.exports = {
  toArr,
  arrToObj,
  // arr,
  // obj,
  timer,
  inspect,
  deepReplace,
  resolve,
  port,
  file,
  log,
  flags,
  Aliaser,
}
