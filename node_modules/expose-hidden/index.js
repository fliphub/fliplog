module.exports = function assignHidden(obj, thisArg) {
  if (!thisArg) thisArg = obj
  const keys = Object.keys(obj)
  Object
    .getOwnPropertyNames(
      Object
        .getPrototypeOf(obj))
        .filter((key) => typeof obj[key] === 'function')
        .forEach((key) => {
          // console.log(key)
          if (!keys.includes(key)) {
            if (typeof obj[key].bind === 'function') {
              obj[key] = obj[key].bind(thisArg)
            } else {
              obj[key] = obj[key]
            }
          }
        })
}
