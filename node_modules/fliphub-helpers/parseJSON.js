module.exports = function tryJSON(json) {
  try {
    const parsed = JSON.parse(json)
    return parsed
  } catch (e) {
    return false
  }
}
