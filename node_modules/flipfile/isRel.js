// @TODO: could trim too
module.exports = function isRel(url) {
  if (!url || !url.slice) return false
  return (/^(\.){1,2}(\/){1,2}$/.test(url.slice(0, 3)) ||
    /(\/){1,2}(\.){1,2}(\/){1,2}/.test(url)) ||
    url.indexOf('./') === 0 ||
    url.indexOf('../') === 0
}
