const ChainedMap = require('chain-able/TraverseChain')
// const traverse = require('./traverse')
// const log = require('fliplog')

let clone

class Cleaner extends ChainedMap {
  /**
   * @param  {Cleaner | Chainable | null} [parent=null]
   */
  constructor(parent = null) {
    super(parent)
    this.data = this.obj.bind(this)
    this.clean = this.clean.bind(this)
  }

  /**
   * @param  {Object | null} [obj=null]
   * @return {Cleaner} @chainable
   */
  static init(obj = null) {
    if (obj === null) {
      return new Cleaner()
    }
    return new Cleaner().obj(obj).onMatch()
  }

  /**
   * @alias data
   * @param  {Object | null} [obj=null]
   * @return {Cleaner} @chainable
   */
  obj(obj = null) {
    if (!obj) return this
    return this.set('obj', obj)
  }

  /**
   * @desc clone the object - lodash.cloneDeep can infinitely loop so need a better one
   * @since fliplog:v0.3.0-beta6
   * @param  {Object | any} [obj=null]
   * @return {Cleaner} @chainable
   */
  clone(obj = null) {
    clone = clone || require('../../')('lodash.clonedeep')
    return this.set('obj', clone(obj))
  }

  /**
   * @desc runs traverser, checks the tests, calls the onMatch
   *       @modifies this.cleaned
   * @return {any} this.obj/data cleaned
   */
  clean() {
    return this.set('cleaned',  this.traverse(true))
  }

  cleaned() {
    return this.get('cleaned')
  }
}

module.exports = Cleaner
