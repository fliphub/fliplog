// http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
module.exports = function isNum(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}
