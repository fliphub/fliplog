const log = require('./')

function toArr(data, includeEmpty) {
  if (!data && !includeEmpty) return []
  if (Array.isArray(data)) return data
  else return [data]
}

function debugFor(keys, msg, color, data) {
  keys = toArr(keys)
  if (this.whiteflags) {
    for (let i in this.whiteflags) {
      const key = this.whiteflags[i]
      if (keys.includes(key)) return log

      // match all
      else if (keys === '*') return log
      else if (keys.includes('*')) return log
      else if (key === '*') return log
    }
  }
  return log.new().silent(true)
}

module.exports = {
  debugFor,
  debugForFlags: (whiteflags) => debugFor.bind({whiteflags: toArr(whiteflags)}),
}
