// or resolve matching
module.exports = function forKeys(resolve, obj, keys) {
  for (let key in obj) {
    if (keys.includes(key)) obj[key] = resolve(obj[key])
  }
  return obj
}
