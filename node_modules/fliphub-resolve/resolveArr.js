const isRel = require('flipfile/isRel')

module.exports = function resolveArr(resolve, arr) {
  for (let i in arr)
    if (isRel(arr[i])) arr[i] = resolve(arr[i])
  return arr
}
