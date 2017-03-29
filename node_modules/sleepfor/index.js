module.exports = function sleepFor(sleepDuration) {
  var now = new Date().getTime()
  while (new Date().getTime() < now + sleepDuration) { /* do nothing */ }
}
