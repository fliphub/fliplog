// @TODO:
// use some sugar syntax to replace this function call
// with the variable name passed to it
//
// isObject(variableName) ---> variableName && typeof variableName === 'object'
//
// https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
//
// could also add this in webpack provide / define plugin
module.exports = function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
