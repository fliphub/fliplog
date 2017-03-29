module.exports = function toArr(data, opts = {includeEmpty: false, split: ','}) {
  const {includeEmpty, split} = opts

  if (!data && !includeEmpty) return []
  if (Array.isArray(data)) return data
  if (typeof data === 'string' &&
    typeof split === 'string' &&
    data.includes(split)) {
    return data.split(split)
  }
  else return [data]
}

module.exports.slice = Array.prototype.slice.call.bind(Array.prototype.slice)
