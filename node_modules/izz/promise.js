module.exports = function isPromise(val) {
  return val
    && typeof val.then === 'function' &&
    typeof val.catch === 'function'
}
