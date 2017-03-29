// // require('../../../')
// module.exports = function hijacker(flipRootPath) {
//   const Aliaser = require('./Aliaser')
//   const aliaser = new Aliaser(flipRootPath)
//   const path = require('path')
//
//   const relativeAliases = {
//     'flags': './lib/flags',
//     'hubs': './lib/flags',
//   }
//   const aliases = aliaser.fromObj(relativeAliases)
//
//   global.aliasImport = function(name) {
//     if (name.includes('/')) {
//       const split = name.split('/')
//       const possibleAlias = name.shift()
//       const after = name.join('/')
//       const aliased = aliases[possibleAlias]
//       if (aliased)
//         return require(aliased + '/' + after)
//     }
//     if (name.includes('~')) {
//       const fromHome = name.replace('~', '')
//       const fullPath = require(path.resolve(flipRootPath, fromHome))
//       return require(fullPath)
//     }
//
//     if (aliases[name]) return require(aliases[name])
//     return require(name)
//   }
// }
