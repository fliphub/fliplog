const camelCase = require('./camel-case')

// if dependency is already installed, use it, otherwise, fallback to inlined
module.exports = function requireFromDepIfPossible(name) {
  const type = typeof name

  // allow returning an obj
  if (type !== 'string' && Array.isArray(name)) {
    const obj = {}
    name.forEach(n => {
      obj[camelCase(n)] = requireFromDepIfPossible(n)
    })
    return obj
  }
  else if (type !== 'string' && type === 'object') {
    const obj = {}
    Object.keys(name).forEach(n => {
      obj[camelCase(n)] = requireFromDepIfPossible(n)
    })
    return obj
  }

  try {
    require.resolve(name)
    return require(name)
  }
  catch (e) {
    return require('./' + name)
  }
}
