// const funcProto = Function.prototype
// const objectProto = Object.prototype
// const funcToString = funcProto.toString
// const hasOwnProperty = objectProto.hasOwnProperty
// const objectCtorString = funcToString.call(Object)
// const objectToString = objectProto.toString
// const objectTag = '[object Object]'
// function overArg(func, transform) {
//   return function(arg) {
//     return func(transform(arg))
//   }
// }
//
// // isPlainObject
// function isPlainObject(value) {
//   if (!isObjectLike(value) ||
//     objectToString.call(value) != objectTag || isHostObject(value)) {
//     return false
//   }
//   let proto = overArg(Object.getPrototypeOf, Object)(value)
//   if (proto === null) {
//     return true
//   }
//   let Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor
//   return (typeof Ctor === 'function' &&
//     Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString)
// }

// http://stackoverflow.com/questions/34111902/why-do-lodashs-isobject-isplainobject-behave-differently-than-typeof-x
module.exports = require('lodash.isplainobject')
