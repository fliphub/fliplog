// https://msdn.microsoft.com/en-us/library/dd456845(v=vs.110).aspx
// https://github.com/Hypercubed/_F
// http://eliperelman.com/fn.js/
// http://pothibo.com/2013/7/memoizations-accessories-private-variable-in-javascript
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Property_accessors
// https://gist.github.com/keeto/273490
// http://knockoutjs.com/documentation/custom-bindings.html
// http://javascriptplayground.com/blog/2013/12/es5-getters-setters/
// http://batmanjs.org/docs/accessors.html
// http://ejohn.org/blog/javascript-getters-and-setters/
// https://github.com/tvcutsem/harmony-reflect
//
// minimal OR simple OR microjs OR tiny observable
// minimal OR simple OR microjs OR tiny data OR object observable
// https://github.com/knockout/knockout/blob/master/src/subscribables/observable.js
// https://www.npmjs.com/package/simple-observable
//
// https://canjs.com/
// https://github.com/canjs/can-observation

// computed({
//   execute: {
//     with: ['deps.no', ''],
//     get() {
//
//     },
//   },
// }).scope(this)

require('../log')
const _get = require('lodash.get')
// const fnParams = require('./fnParams')

// could merge the two too
// or extend the originally computed
function extend(data, extension) {
  data = Object.assign(data, extension)
  return computed(data)
}

// changes for all ever
// const history = new Map()
const history = {}

// not working on obj
// decorated.inspect = inspectorGadget(decorated, {val: data})
// decorated.inspect = function inspect() {
//   return data
//   // inspectorGadget(decorated, {val: data})
// }
class Decorated {
  constructor() {
    this.inspect = inspectorGadget(this, ['call', 'computed'])
  }
}

// @TODO:
// option to return class
// computed.classFrom
function computed(data) {
  // const decorated = {}
  // const decorated = data

  // messes when using one class with another class
  // Object.assign(new Decorated(), data)
  const decorated = data

  const values = {}
  const keys = Object.keys(data)

  // history.set(data, {})

  // extend computed
  // bind data to first arg
  // @example: computed(data).computed(xt)

  decorated.computed = extend.bind(null, data)
  decorated.computed.schema = data

  // add them all first,
  // is not perf but is clean
  keys.forEach(key => values[key] = data[key])

  // then decorate
  keys.forEach(key => {
    // @NOTE: just experiment
    // history[key] = {}

    // if it has dependencies
    // we decorate
    var value = data[key]

    // could also decorate this so it returns if needed
    if (typeof value === 'function') {
      decorated[key] = value.bind(decorated)
    }

    // just like in a decorator
    var refToValGet = value.get
    var refToValSet = value.set
    var refToValCall = value.call
    var valueWiths = value.with || []
    var args = value.args
    var hasNoWithOrVal = false

    if (valueWiths || refToValGet || refToValSet) {
      const withs = valueWiths.map(propertyName => _get(values, propertyName))
      const definitions = {
        // enumerable: true,
        // configurable: true
      }
      if (refToValGet) {
        definitions.get = function() {
          // @NOTE: was apply `this`
          return refToValGet.apply(decorated, withs)
        }
      }
      if (refToValSet) {
        definitions.set = function() {
          // take arguments, add the withs
          const args = Object.values(arguments).concat(withs)
          const result = refToValSet.apply(decorated, args)

          // @NOTE: experiment: works, just is disabled
          // history.get(data)[key] = result
          // history[key][Date.now()] = {result, args}
          // console._exit(history)

          if (!result) return this
          return result
        }
      }
      Object.defineProperty(decorated, key, definitions)
    } else {
      hasNoWithOrVal = true
    }

    if (refToValCall) {
      //  && !decorated.call
      if (decorated.call === true) decorated.call = {}
      // could auto detect whether to pass in deps...
      // let callParams = fnParams(refToValCall)
      // let callArgs = []
      let callAppendedArgs = []
      // if (args) callArgs = args
      if (valueWiths) {
        callAppendedArgs = valueWiths.map(propertyName => _get(values, propertyName))
      }

      // callAppendedArgs.push(decorated.computed)

      if (decorated.call) {
        decorated.call[key] = function() {
          const callArgs = Object.values(arguments).concat(callAppendedArgs)
          return refToValCall.apply(this, callArgs)
        }
      }
    } else if (hasNoWithOrVal) {
      decorated[key] = value
    }
  })

  return decorated
}

module.exports = computed
