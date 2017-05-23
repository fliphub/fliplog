require('jsdom-global')()
const is = require('../modules/is-nodejs')

console.log(is)
const {isNode, isWeb, hasWindow, isWebWorker} = is
console.log({isNode, isWeb, hasWindow, isWebWorker})
