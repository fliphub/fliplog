function hasKey(obj, keys) {
  var o = obj
  const sliced = keys.slice(0, -1)

  for (let i = 0; i < sliced.length; i++) {
    const key = sliced[i]
    o = o[key] || {}
  }

  var key = keys[keys.length - 1]

  return o[key] !== undefined
}

function isNum(x) {
  if (typeof x === 'number') return true
  if (/^0x[0-9a-f]+$/i.test(x) === true) return true
  return (/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/).test(x)
}

// function isArr(x, type = 'array') {
//   if (type === 'array') {
//     if (typeof x === 'string' && x.includes) {
//       if (x.includes(',') === true) return x.split(',')
//     }
//     return [x]
//   }
// }

// function isNullOrUndef(x) {
//   if (/undefined/.test(x)) return undefined
//   if (/null/.test(x)) return null
// }

/**
 * @tutorial http://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
 * @tutorial https://github.com/sindresorhus/camelcase
 * @param  {string} str
 * @return {string}
 *
 * s.charAt(0).toLowerCase() + string.slice(1)
 */
function camelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
      if (+match === 0) return '' // or if (/\s+/.test(match)) for white spaces

      // needs to be a loose 0 or first char will be uc if first char is -
      // eslint-disable-next-line
      return index == 0 ? match.toLowerCase() : match.toUpperCase()
    })
    .replace(/[-_]/g, '')
}

/**
 * @desc this duplicates keys, is simplest fastest
 * @NOTE mutates obj
 * @param  {Object} obj
 * @return {Object}
 */
function camelCaseKeys(obj) {
  const keys = Object.keys(obj)
  const camelKeys = keys.map(camelCase)
  for (let i = 0; i < keys.length; i++) {
    const camel = camelKeys[i]
    // console.log({camel, camelKeys, i, keys, c: camelKeys[i], k: keys[i]})
    if (camel.length === 0) continue
    obj[camel] = obj[keys[i]]
  }
  return obj
}

module.exports = {hasKey, isNum, camelCaseKeys}
