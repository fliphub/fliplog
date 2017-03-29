const iss = require('is')
const toarr = require('to-arr')
const isObject = require('./obj')
const isPromise = require('./promise')
const isBindable = require('./bindable')
const toType = require('./toType')
const isObjectLike = require('./objLike')
const isGenerator = require('./gen')
const isFunction = require('./func')
const windows = require('./windows')
const isNotSet = require('./notSet')
const isSet = require('./set')
const isMap = require('./map')
const num = require('./num')
const arrOf = require('./arrOf')
const ci = require('./ci')
const isPlainObject = require('./plainObj')

// @TODO: add support for plurals
// loop, give back string of them
function toTypes(variables) {
  return variables.map((variable) => toType(variables))
}

function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  let result = false
  if (value != null && typeof value.toString !== 'function') {
    try {
      result = !!(value + '')
    } catch (e) { }
  }
  return result
}


function webpackCli() {
  // const flags = require('flipflags')
  // return flags('bin/webpack', {type: 'bool'})
}

const is = Object.assign({
  num,
  windows,
  real: (val) => !isNotSet(val),
  notSet: isNotSet,
  emptyStr: (val) => val === '',
  emptyObj: (val) => isObjectLike(val) && Object.keys(val).length,
  str: (value) => typeof value === 'string',
  string: (value) => typeof value === 'string',

  // careful for es3...
  class: require('./class'),

  set: isSet,
  map: isMap,

  array: Array.isArray,
  arr: Array.isArray,
  arrOf,

  isObject,
  obj: isObject,
  isObjectLike,
  isObjLike: isObjectLike,
  plainObject: isPlainObject,
  plainObj: isPlainObject,
  hostObject: isHostObject,
  hostObj: isHostObject,

  function: isFunction,
  fn: isFunction,
  bindable: isBindable,
  promise: isPromise,
  generator: isGenerator,
  gen: isGenerator,

  ci,
  webpackCli,

  toType,
  toTypes,
  instanceOf: function instanceOf(arg1, arg2) {
    return arg1 instanceof arg2
  },
}, iss)

is.notReal = (val) => !is.real(val)


const FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m
const FN_ARG_SPLIT = /,/
const FN_ARG = /^\s*(_?)(\S+?)\1\s*$/
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
function fnParams(fn) {
  let args = []
  let fnText = fn.toString().replace(STRIP_COMMENTS, '')
  let argDecl = fnText.match(FN_ARGS)
  let r = argDecl[1].split(FN_ARG_SPLIT)

  for (let i = 0; i < r.length; i++) {
    let arg = r[i]
    arg.replace(FN_ARG, (all, underscore, name) => {
      args.push(name)
    })
  }

  return args
}

const propertyDefined = (arg, prop) => {
  return arg[prop] !== undefined || arg.hasOwnProperty(prop)
}

// https://github.com/chaijs/chai/issues/72
is.properties = (arg, fnArgs) => {
  return !!toarr(fnArgs).map((prop) => propertyDefined(arg, prop)).length
}
is.hasProps = is.properties
is.props = is.properties

is.each = (args, fn) => {
  if (typeof fn === 'string') fn = is[fn]
  return !!args.filter((arg) => fn(arg)).length
}

is.all = (args, fns = []) => fns.map((fn) => {
  if (typeof fn === 'string') fn = is[fn]
  if (fnParams(fn).length && Array.isArray(args)) {
    return fn.apply(null, args)
  }
  return fn(args)
})

module.exports = is
