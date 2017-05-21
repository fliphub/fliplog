module.exports = function getDep(name) {
  try {
    require.resolve(name)
    return require(name) // eslint-disable-line
  }
  catch (e) {
    return false
  }
}
