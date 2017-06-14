// https://github.com/sindresorhus/matcher/blob/master/index.js
const toArr = x => [].concat(x)
const escapeStringRegexp = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
const toRegExp = str => escapeStringRegexp(str).replace(/\\\*/g, '.*')
const isFunction = x => typeof x === 'function' || x instanceof Function
const isRegExp = x => x instanceof RegExp

// @TODO: default strings without slashes to node_modules, if that is best
const reCache = new Map()

function map(patterns, shouldNegate, beginningEnd = false) {
  return toArr(patterns).map(pattern =>
    makeRe(pattern, shouldNegate, beginningEnd)
  )
}
function makeRe(pattern, shouldNegate, beginningEnd = false) {
  const cacheKey = pattern + shouldNegate
  if (reCache.has(cacheKey)) return reCache.get(cacheKey)

  // @NOTE: added for function callbacks
  if (isFunction(pattern) && !pattern.test) pattern.test = pattern
  if (isFunction(pattern) || isRegExp(pattern)) return pattern

  let negated = pattern[0] === '!'
  if (negated) pattern = pattern.slice(1)

  pattern = toRegExp(pattern)

  if (negated && shouldNegate) pattern = `(?!${pattern})`
  let re = new RegExp(`${pattern}`, 'i')
  if (beginningEnd === true) re = new RegExp(`^${pattern}$`, 'i')

  re.negated = negated
  reCache.set(cacheKey, re)

  return re
}

const matcher = (inputs, patterns) => {
  if (!(Array.isArray(inputs) && Array.isArray(patterns))) {
    throw new TypeError(
      `Expected two arrays, got ${typeof inputs} ${typeof patterns}`
    )
  }

  if (patterns.length === 0) return inputs
  const firstNegated = patterns[0][0] === '!'
  const matchesToReturn = []
  patterns = patterns.map(x => makeRe(x, false))

  inputs.forEach(input => {
    // If first pattern is negated we include everything to match user expectation
    let matches = firstNegated

    // TODO: Figure out why tests fail when I use a for-of loop here
    for (let j = 0; j < patterns.length; j++) {
      if (patterns[j].test(input)) {
        matches = !patterns[j].negated
      }
    }

    if (matches) matchesToReturn.push(input)
  })

  return matchesToReturn
}

const isMatch = (input, pattern, negate = false, beginningEnd = false) =>
  map(pattern, negate, beginningEnd).map(fn => fn.test(input))

const isMatchCurry = (pattern, negate = false, beginningEnd = false) => input =>
  matcher(input, map(pattern, negate, beginningEnd))

module.exports = matcher
module.exports.isMatch = isMatch
module.exports.isMatchCurry = isMatchCurry
module.exports.makeRe = makeRe
module.exports.matcher = matcher
module.exports.map = map
