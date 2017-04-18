// 1
// 'newc x 164 ops/sec ±17.76% (60 runs sampled)',
// 'oldc x 16.25 ops/sec ±5.82% (41 runs sampled)',
// 'new x 1,401 ops/sec ±3.43% (78 runs sampled)',
// 'old x 20.34 ops/sec ±6.23% (37 runs sampled)',
// 'newFun x 1,312 ops/sec ±7.45% (76 runs sampled)',
// 'oldFun x 1,120 ops/sec ±1.48% (82 runs sampled)'

// 2
// 'newc x 112 ops/sec ±32.57% (42 runs sampled)',
// 'oldc x 16.87 ops/sec ±7.89% (30 runs sampled)',
// 'new x 1,449 ops/sec ±2.26% (81 runs sampled)',
// 'old x 21.80 ops/sec ±2.04% (40 runs sampled)',
// 'newFun x 1,391 ops/sec ±6.36% (80 runs sampled)',
// 'oldFun x 1,112 ops/sec ±1.92% (81 runs sampled)',
// 'newFunReq x 2,143 ops/sec ±3.95% (80 runs sampled)',
// 'oldFunReq x 16.33 ops/sec ±3.55% (33 runs sampled)'

// 3
// 'newc x 153 ops/sec ±34.52% (72 runs sampled)',
// 'oldc x 17.63 ops/sec ±4.23% (42 runs sampled)',
// 'new x 1,425 ops/sec ±2.50% (81 runs sampled)',
// 'old x 21.62 ops/sec ±1.89% (39 runs sampled)',
// 'newFun x 1,380 ops/sec ±5.85% (77 runs sampled)',
// 'oldFun x 1,066 ops/sec ±4.62% (75 runs sampled)',
// 'newFunReq x 2,145 ops/sec ±2.29% (81 runs sampled)',
// 'oldFunReq x 12.23 ops/sec ±42.38% (30 runs sampled)'

// 4 - when enabling try catch for deps
// 'newc x 145 ops/sec ±28.94% (49 runs sampled)',
// 'oldc x 18.26 ops/sec ±3.11% (44 runs sampled)',
// 'new x 1,436 ops/sec ±2.13% (77 runs sampled)',
// 'old x 22.17 ops/sec ±5.60% (40 runs sampled)',
// 'newFun x 1,375 ops/sec ±4.64% (74 runs sampled)',
// 'oldFun x 1,128 ops/sec ±1.24% (79 runs sampled)',
// 'newFunReq x 2,188 ops/sec ±4.72% (75 runs sampled)',
// 'oldFunReq x 16.97 ops/sec ±2.68% (32 runs sampled)'


const clearRequire = require('clear-require')

// const timer = require('fliptime')
// const log = require('./_old')
// log.quick(require('./_old'))

var Benchmark = require('benchmark')
var suite = new Benchmark.Suite()
var newMem = null
var oldMem = null
var newI = 0
var oldI = 0
var oldLog = null
var newLog = null

const newLogFn = require('../')
const oldLogFn = require('./_old')
// newLogFn.startCapturing()

const newFn = () => {
  for (var i = 0; i < 10; i++) {
    newLogFn.text('new: ' + newI++).color('bold').echo(false)
    newLogFn.bold('new: ' + newI).data({eh: true}).echo(false)
    newLogFn.bold('new: ' + newI).data(newLogFn, 'secondArg').returnVals()
    newLogFn.xterm(100).highlight().json({props: true}).echo(false)
  }
}

const oldFn = () => {
  for (var i = 0; i < 10; i++) {
    oldLogFn.text('old: ' + oldI++).color('bold').echo(false)
    oldLogFn.bold('old: ' + oldI).data({eh: true}).echo(false)
    oldLogFn.bold('old: ' + oldI).data(oldLogFn, 'secondArg').returnVals()
    oldLogFn.xterm(100).highlight().json({props: true}).echo(false)
    oldLogFn.xterm(100).highlight().json({props: true}).echo(false)
  }
}


// ------ clear

const newFnClear = () => {
  for (var i = 0; i < 10; i++) {
    newLogFn.text('new: ' + newI++).color('bold').echo()
    newLogFn.bold('new: ' + newI).data({eh: true}).echo()
    newLogFn.bold('new: ' + newI).data(newLogFn, 'secondArg').returnVals()
    newLogFn.xterm(100).highlight().json({props: true}).echo()
    newLogFn.emoji('phone').text('emoji').echo()
    // newLogFn.addSpinner('key1', 'spinner 1 msg')
    // newLogFn.addSpinner('key2', 'spinner 2 msg')
    // newLogFn.addSpinner('key3', 'spinner 3 msg')
    // newLogFn.startSpinners()
    // newLogFn.removeSpinner()

    newLogFn.clear()
  }
}

const newFnTrace = () => newLogFn.track().echo()
const oldFnTrace = () => oldLogFn.track().echo()

const oldFnClear = () => {
  for (var i = 0; i < 10; i++) {
    oldLogFn.text('old: ' + oldI++).color('bold').echo()
    oldLogFn.bold('old: ' + oldI).data({eh: true}).echo()
    oldLogFn.bold('old: ' + oldI).data(oldLogFn, 'secondArg').returnVals()
    oldLogFn.xterm(100).highlight().json({props: true}).echo()
    oldLogFn.emoji('phone').text('emoji').echo()
    // oldLogFn.addSpinner('key1', 'spinner 1 msg')
    // oldLogFn.addSpinner('key2', 'spinner 2 msg')
    // oldLogFn.addSpinner('key3', 'spinner 3 msg')
    // oldLogFn.startSpinners()
    // oldLogFn.removeSpinner()

    oldLogFn.clear()
  }
}


// ------ filter

const newFnFun = () => {
  for (var i = 0; i < 10; i++) {
    newLogFn.bold().box('fliplog').echo(false)
    newLogFn.preset('warning').data(' this message will self destruct').echo(false)
    newLogFn.time(true).xterm(202, 236).text(' orange!!! ').echo(false)

    newLogFn.from({
      data: 'data',
      text: 'eh',
      color: 'bold',
      echo: false,
    })
  }
}

const oldFnFun = () => {
  for (var i = 0; i < 10; i++) {
    oldLogFn.bold().box('fliplog').echo(false)
    oldLogFn.preset('warning').data(' this message will self destruct').echo(false)
    oldLogFn.time(true).xterm(202, 236).text(' orange!!! ').echo(false)

    oldLogFn.from({
      data: 'data',
      text: 'eh',
      color: 'bold',
      echo: false,
    })
  }
}


const newReqFn = () => {
  newMem = process.memoryUsage()
  // console.log('log new: ', newMem)
  for (var i = 0; i < 10; i++) {
    // clearRequire.all()
    const log = require('../')
    log.text('new: ' + newI++).color('bold').echo(false)
  }

  // console.log('done new')
  newLog = require('../')
}

const oldReqFn = () => {
  oldMem = process.memoryUsage()
  // console.log('log old: ', oldMem)
  for (var i = 0; i < 10; i++) {
    clearRequire.all()
    const log = require('./_old')
    log.text('old: ' + oldI++).color('bold').echo(false)
  }
  // console.log('done old')
  oldLog = require('./_old')
}

let cycles = []

suite
  .add('newc', newFnClear)
  .add('oldc', oldFnClear)
  .add('new', newFn)
  .add('old', oldFn)
  .add('newFun', newFnFun)
  .add('oldFun', oldFnFun)
  .add('newFunReq', newReqFn)
  .add('oldFunReq', oldReqFn)


  .on('cycle', (event) => {
    // console.log('\n\n\n\n\n\n\n\n\n\n\n')
    console.log(String(event.target))
    cycles.push(String(event.target))
  })
  .on('complete', function() {
    // console.log('oldMem: ', oldMem)
    // console.log('newMem: ', newMem)
    console.log('Fastest is ' + this.filter('fastest').map('name'))
    console.log('================')
    console.log(this.map(bnch => bnch.times.elapsed))
    // setTimeout(() => {
    //   const log = require('../')
    //   log.quick({newLog, oldLog})
    // }, 1000)
    console.log(cycles)
  })
 .run({'async': false})


// console.log(process.memoryUsage())
// timer.start('old')
// require('./_old')
// timer.stop('old').log('old')
// console.log(process.memoryUsage())
//
// clearRequire.all()
// console.log(process.memoryUsage())
//
// timer.start('new')
// require('../index')
// console.log(process.memoryUsage())
// timer.stop('new').log('new')
