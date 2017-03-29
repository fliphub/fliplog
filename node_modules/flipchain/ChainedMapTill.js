const ChainedMapExtendable = require('./ChainedMapExtendable')

class ChainedMapTill extends ChainedMapExtendable {
  constructor(parent, keys) {
    super(parent)
    this.setupKeys(keys)
  }

  // @TODO: `or`
  static from(parent, keys, obj) {
    return new ChainedMapTill(parent, keys).use(obj)
  }

  // used to bypass keys if you just pass in everything as obj
  use(obj) {
    if (obj) {
      for (const key in obj) {
        this.set(key, obj[key])
      }
      return this.parent
    }
    return this
  }

  setupKeys(keys) {
    this._keys = keys
    this.keysToUse = keys.length
    this.keysCalled = 0
    this.extend(keys)
    keys.forEach(key => {
      if (this[key]) {
        const ref = this[key]
        this[key] = (...args) => {
          ++this.keysCalled
          const res = ref(...args)
          if (this.keysToUse === this.keysCalled) return this.parent
          return res
        }
      }
    })
  }

  // maybe another name
  and() {
    --this.keysCalled
    return this
  }
}

module.exports = ChainedMapTill
