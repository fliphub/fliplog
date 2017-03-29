// checks if the function can be bound
// @example `() => {}` cannot be bound
// @example `function() {}` can be bound
module.exports = function isBindable(func) {
  return func && func.hasOwnProperty('prototype')
}
