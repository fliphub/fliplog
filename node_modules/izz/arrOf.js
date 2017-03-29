module.exports = function arrOf(arr, is) {
  if (!Array.isArray(arr)) return false
  return arr.filter(is).length
}
