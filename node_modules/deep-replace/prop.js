// loops through objects nested
// assigns or deletes property
//
// using var to keep easy scope
function deepReplaceProp(obj, property, val) {
  // https://github.com/aretecode/eslint-plugin-no-for-each
  const propKeys = Object.keys(obj)
  for (let i = 0, len = propKeys.length; i < len; i++) {
    const prop = propKeys[i]
    const child = obj[prop]

    // if child is an object and has the prop
    if (child && typeof child === 'object') {
      if (child[property]) {
        if (val === undefined) delete child[property]
        else child[property] = val
        // found it, but keep going in case it has nested refs
        deepReplaceProp(child, property)
      }
      else {
        // didn't find it, keep going, it is an object
        deepReplaceProp(child, property)
      }
    }
    // otherwise, is not an object, no more children
  }
}

module.exports = deepReplaceProp
