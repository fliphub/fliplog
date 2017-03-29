const path = require('path')

// type AliasType = {
//   // fs path
//   string: string,
//   ...
// }

class Aliaser {
  // string
  constructor(dirname, prefix = '') {
    this.__dirname = dirname
    this.prefix = prefix
  }

  setDir(dirname) {
    this.__dirname = dirname
  }

  // string => mixed
  resolve(relativePath) {
    // console.log({relativePath}, this.__dirname)
    return path.resolve(this.__dirname, relativePath)
  }

  // AliasType => AliasType
  reAlias(aliases) {
    const keys = Object.keys(aliases)
    keys.forEach(key => {
      const val = aliases[key]
      aliases[key] = this.resolve(val)
    })
    return aliases
  }

  // alias all of these
  // so we can use relative paths
  //
  // and also include them in the babel loader
  // (which we ought to be more explicit about)
  //
  // Array<AliasType> => AliasType
  mergeAliases(aliases) {
    const magicAliases = {}
    // [{aliasEh: 'eh'}, {aliasCanada: 'canada'}]
    // -> {aliasEh}
    // ->> 'aliasEh'
    aliases.forEach(aliasGroup => Object.keys(this.reAlias(aliasGroup)).forEach(key => {
      const alias = aliasGroup[key]
      magicAliases[key] = alias
    }))

    return magicAliases
  }

  fromObj(aliases) {
    // go through the object keys
    // assign to config
    // resolve the value
    const resolvedAliases = {}
    const keys = Object.keys(aliases)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const alias = aliases[key]
      resolvedAliases[alias] = this.resolve(alias)
    }
    return resolvedAliases
  }

  // AliasType => ?AliasType
  requireAlias(alias) {
    if (typeof alias !== 'string' && typeof alias == 'object') return alias
    const resolved = this.resolve(this.prefix + alias)
    const required = require(resolved)
    return required
  }

  // @TODO: flush out
  // Array<AliasType> | AliasType => AliasType
  requireAndHandle(aliases, config) {
    if (Array.isArray(aliases))
      return this.handle(aliases.map(alias => this.requireAlias(alias)))
    return this.handle(this.requireAlias(aliases))
  }

  // Array<AliasType> | AliasType => AliasType
  handle(aliases) {
    if (Array.isArray(aliases)) return this.mergeAliases(aliases)
    return this.reAlias(aliases)
  }
}

module.exports = Aliaser
