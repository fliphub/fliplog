const bad = ['constructor']

// get all methods from workspace
// proxy them from here
//
// ignore them all in the verbose debug inspection
module.exports = function({child, parent, thisArg}) {
  if (!thisArg) thisArg = child

  try {
    const proto = Object.getPrototypeOf(child)
    const methods = Object.getOwnPropertyNames(proto)

    for (let i = 0; i < methods.length; i++) {
      const method = methods[i]
      if (bad.includes(method)) continue

      // this[method] = () => this.ws[method].apply(null, arguments)
      //
      // manually spreading them, es5 yo, by ref
      parent[method] = (a, b, c, d, e, f, g, h, i, j, k, l, m, n) =>
        child[method].apply(thisArg, [a, b, c, d, e, f, g, h, i, j, k, l, m, n])
    }
  } catch (e) {
    console._error(e)
    return e
  }
}
