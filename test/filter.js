// eslint func-names: OFF
// eslint-disable-next-line
'use strict'

const log = require('../')
const enhanced = require('../deps/assert')
const {Chain, toArr} = require('chain-able')

// const log = require('../test/_old')

// log.capture()
// console.log('eh out')
// log.stopCapturing()
// console.assert(log.savedLog.length > 0, 'has saved logs')
// process.exit()

// - means no
// + means yes: always
// # for priority?
//
//
// blank means yes, unless another tag overrides?
// but that is silly since it is default

const done = []

// .method('plan', function() {
//   console.log(this)
//   return this
// })
Chain.prototype.method = function(name, fn) {
  this[name] = function(a, b, c, d, e) {
    return fn.call(this, a, b, c, d, e)
  }
  return this
}
Chain.prototype.methods = function(fns) {
  Object.keys(fns).forEach(key => {
    this[key] = fns[key].bind(this)
  })
  return this
}

// const assert = require('assert')
// const enhancedAssert = enhanced(assert)
const powerAssert = require('power-assert')

const planner = new Chain()
  .wrap(chain => chain.set('assertions', []))
  .extendGetSet(['assertions'])
  .extend(['timeout'])
  .methods({
    plan(times) {
      const cb = () => {
        try {
          powerAssert(this.get('assertions').filter(Boolean).length === times)
        }
        catch (e) {
          log.data(e).bold('did not have the same length assertions').echo()
        }
      }

      this.timeoutcb = cb
      this.resetTimeout = () => {
        clearTimeout(this.timeouts)
        this.timeouts = setTimeout(cb, this.get('timeout'))
      }

      this.resetTimeout()
      return this.set('plan', times)
    },
    assert(assertion) {
      const assertions = toArr(assertion).map(powerAssert)
      return this
        .tap('assertions', arr => arr.concat(assertions))
        .wrap(() => this.resetTimeout)
    },
  })

// log.data(planner.plan()).exit()

// planner.timeout(1).plan(3)

log.filter(args => {
  if (planner.getAssertions().length === 2) {
    planner.assert(true)
    return true
  }
  else {
    planner.assert(typeof args === 'object')
  }

  return null
})

const arg1 = log.tags('args,canada').text('args').echo()
const arg2 = log.tags('me').text('me').echo()

// ^ arg1 & arg2 make 2 assertions, this one is allowed
const eh = log.blue('allowed').echo()

// does not call filter, is forceEcho
log.red('.forceEcho()').forceEcho()

// .echo()

// console.log(arg1, arg2)
