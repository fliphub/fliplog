const {inspectorGadget} = require('inspector-gadget')

class Chainable {
  constructor(parent) {
    this.parent = parent
    this.inspect = inspectorGadget(this, ['parent', 'workflow'])
    if (this.onConstructor) this.onConstructor(parent)
  }
  end() {
    return this.parent
  }
}

module.exports = Chainable
