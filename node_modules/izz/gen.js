module.exports = function isGenerator(fn) {
  return fn.constructor.name === 'GeneratorFunction'
}
