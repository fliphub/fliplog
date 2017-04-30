const ChainedMapExtendable = require('flipchain/ChainedMapExtendable.js')
const {OFF, objToStr} = require('./deps')
const configs = require('./config')
const DynamicDeps = require('./deps/DynamicDeps')

const pkgDebug =
  (configs.pkg !== undefined &&
    configs.pkg.fliplog !== undefined &&
    configs.pkg.fliplog.debug === true) ||
  process.argv.includes('--fliplog')

const plugins = configs.exportee
const shh = {
  shushed: false,
}
let shushed = {}

/**
 *
 * @TODO:
 * - [x] change pkg config
 * - [x] be able to pass in .config at runtime to install more dependencies
 * - [x] check pkg json config at runtime
 * - [x] call depflip on postinstall
 * - [x] ensure all tests work
 * - test by installing in another package, release as alpha,
 *  - OR read its own pkg config hahah
 *
 * - ensure all files are in pkg.files
 * - update docs
 *
 * ------
 *
 * lower priority since it's a fair bit of work to mock this
 * unless it can be done with Reflection/Proxy??
 *
 * - add safety to each function so check if dep is installed,
 *    if not, log that it was installed
 *    add to pkgjson config if it has one
 *    continue
 */

class LogChain extends ChainedMapExtendable {

  /**
   * @param  {any} parent
   */
  constructor(parent) {
    super(parent)
    delete this.inspect
    this.version = '0.2.0'

    // this extending is 0microseconds
    this.extend(['title', 'color'])
    this.extendTrue(['space', 'tosource', 'time', 'silent'])

    this.resets = []
    this.presets = {}
    this.log = this.echo
    this.shh = shh
    this.handleParent(parent)

    return this
  }

  /**
   * @param  {string} name
   * @return {FlipLog}
   */
  used(name) {
    return this.set('used', (this.get('used') || []).concat([name]))
  }

  /**
   * @TODO: should wait until done using, store the deps, do all at once, uniq them
   *
   * @param  {Object} obj
   * @return {FlipLog}
   */
  use(obj) {
    if (typeof obj === 'function' && Object.keys(obj).length === 0) {
      obj = obj(this)
    }

    if (this.deps === undefined) {
      this.deps = []
    }

    // @TODO:
    // this way we only use things once
    // and can debug what plugins/middleware/ was used
    if (this.has('used') === true) {
      if (obj.name && this.get('used').includes(obj.name)) {
        return this
      }
    }
    else if (obj.name !== undefined) {
      this.used(obj.name)
      delete obj.name
    }

    /**
     * so we can have a vanilla state with each plugin
     *
     * if it has a reset function,
     * add to an array of reset functions
     */
    if (obj.reset) {
      if (this.resets.includes(obj.reset) === false) {
        this.resets.push(obj.reset.bind(this))
      }
      delete obj.reset
    }

    /**
     * call any initialization decorators
     */
    if (obj.init) {
      obj.init.bind(this)()
    }

    const keys = Object.keys(obj)
    for (let k = 0; k < keys.length; k++) {
      const key = keys[k]
      this[key] = obj[key].bind(this)
    }

    return this
  }

  /**
   * @private
   * @param {any} parent
   * @return {FlipLog}
   */
  handleParent(parent) {
    this.from = super.from.bind(this)
    if (!parent || !(parent instanceof ChainedMapExtendable)) return this

    const entries = parent.entries()
    if (!entries) return this

    const {filter} = entries
    const {presets} = parent

    if (presets) this.presets = presets
    if (filter) this.filter(filter)

    return this
  }

  /**
   * @param  {Boolean} [hardReset=false]
   * @return {FlipLog}
   */
  new(hardReset = false) {
    return this

    // if using hard reset, do not inherit
    // const logChain = new LogChain(hardReset ? null : this)

    // return logChain

    // const expose = require('expose-hidden')

    // so we can extend without reassigning function name
    // delete logChain.name
    //
    // const logfn = (arg, text, color) => {
    //   return logChain.data(arg).text(text).color(color).verbose(10).echo()
    // }
    //
    // expose(logChain)
    // Object.assign(logfn, logChain)
    // return logfn
  }

  /**
   * @perf takes ~500 microseconds
   * reset the state so we do not instantiate every time
   * @return {FlipLog}
   */
  reset() {
    // if (this.resetted === true) return this
    // this.resetted = true
    if (!this.savedLog) this.savedLog = []
    // const timer = require('fliptime')
    // timer.start('reset')
    this.delete('silent')
      .delete('title')
      .delete('tosource')
      .delete('text')
      .delete('color')
      .delete('space')
      // .delete('data')
      .set('data', OFF)
      .verbose(10)

    // timer.start('fns')
    for (let r = 0; r < this.resets.length; r++) {
      this.resets[r]()
    }

    // timer.stop('reset').stop('fns').log('reset').log('fns')

    return this
  }

  // ----------------------------- adding data ------------------

  /**
   * @param  {number | boolean | string | any} data
   * @return {FlipLog}
   */
  verbose(data) {
    if (Number.isInteger(data)) {
      return this.set('verbose', data)
    }
    if (typeof data === 'boolean') {
      return this.set('verbose', data)
    }
    if (!data && data !== false) {
      return this.set('verbose', true)
    }
    if (data === false) {
      return this.set('verbose', false)
    }

    return this.set('data', data).set('verbose', true)
  }

  /**
   * @param {any} arg
   * @return {FlipLog}
   */
  data(arg) {
    if (this.has('formatter') === true) {
      arg = this.get('formatter')(arg)
    }

    if (arguments.length === 1) {
      return this.set('data', arg)
    }

    return this.set('data', Array.from(arguments))
  }

  /**
   * @param  {string | serializable} text
   * @return {FlipLog}
   */
  text(text) {
    if (this.has('title') === true) {
      const title = this.get('title') ? `${this.get('title')}` : ''
      return this.set('text', title + text)
    }

    return this.set('text', text)
  }

  /**
   * @tutorial https://github.com/fliphub/fliplog#-emoji
   * @see FlipLog.title
   * @param {string} name
   * @return {FlipLog}
   */
  emoji(name) {
    const emojiByName = require('./deps/emoji-by-name')
    return this.title(`${emojiByName(name)}  `)
  }

  /**
   * @param {string} msg
   * @param {string} [color=false]
   * @return {FlipLog}
   */
  addText(msg, color = false) {
    if (color !== false) {
      msg = this.getColored(color)(msg)
    }

    if (this.has('text') === true) {
      this.set('text', `${this.get('text')} ${msg}`)
    }
    else {
      this.text(msg)
    }

    return this
  }

  // ----------------------------- actual output ------------------

  /**
   * @param  {boolean} [data=OFF] `false` will make it not output
   * @return {FlipLog}
   */
  echo(data = OFF) {
    // const timer = require('fliptime')
    // timer.start('echo-new')

    if (this.stack !== null && this.stack !== undefined) {
      this.stack()
    }

    if (this.has('tags') === true) {
      this._filter()
    }

    // don't call any formatter middleware, reset state, perf
    if (data === false) {
      this.reset()
      return this
    }

    // data is default, use the stored data
    if (data === OFF) {
      data = this.get('data')
    }

    // everything is silent everywhere,
    // store log with formatter,
    // reset
    if (shh.shushed === true) {
      const text = this.logText()
      const datas = this.logData()
      shushed[Date.now] = {text, datas}
      this.shushed = shushed
      this.reset()
      return this
    }

    // don't call any formatter middleware, silent
    if (this.has('silent') === true) {
      this.reset()
      return this
    }

    // if we are using sleep plugin
    if (this.sleepIfNeeded !== undefined) {
      this.sleepIfNeeded()
    }

    // so we can have them on 1 line
    const text = this.logText()
    const datas = this.logData()

    // check whether the values are default constant OFF
    // so that when we log, they can be on the same console.log call
    // in order to be on the same line
    if (datas === OFF && text === OFF) {
      return this
    }
    // text and no data
    if (datas !== OFF && text === OFF) {
      console.log(datas)
    }
    else if (datas === OFF && text !== OFF) {
      // no data, just text
      console.log(text)
    }
    else if (datas !== OFF && text !== OFF) {
      console.log(text, datas)
    }

    if (this.has('spaces') === true) {
      const spaces = this.logSpaces()
      if (spaces !== '') console.log(spaces)
    }

    // timer.stop('echo-new').log('echo-new')

    this.reset()
    return this
  }

  /**
   * @since 0.1.0
   * @TODO: should call middleware instead of hardcoded methods
   *
   * @private
   * @return {string}
   */
  logText() {
    if (this.has('text') === false) {
      return OFF
    }

    let text = this.get('text')

    // if (text === null || text === undefined || text === null || text === OFF) {
    // if (!text) return OFF

    // convert obj to string
    if (typeof text === 'object') {
      text = objToStr(text)
    }

    if (this.has('color') === true) {
      text = this.getColored(text)
    }
    if (this.has('text') === true) {
      text = this.getTime(text)
    }

    if (this.has('spaces') === true) {
      text += this.logSpaces()
    }

    return text
  }

  /**
   * @TODO: should be array of middleware
   *
   * @private
   * @return {any}
   */
  logData() {
    let data = this.get('data')
    if (data === OFF) return OFF

    if (this.get('expose') === true) {
      const expose = require('expose-hidden')
      data = expose(data)
    }

    data = this.getToSource(data)
    data = this.getVerbose(data)

    return data
  }
}

// ----------------------------- instantiate ------------------

// instantiating + adding + reset = ~10 microseconds
const log = new LogChain().new()

const dd = new DynamicDeps(pkgDebug)
for (let u = 0; u < plugins.length; u++) {
  if (pkgDebug === true) {
    console.log('using plugin', plugins[u])
  }

  dd.use(plugins[u])
  log.use(plugins[u])
}

dd.installIfNeeded().clean()

if (pkgDebug === true) {
  console.log('fliplog setup')
}

log.reset()
log.pkg = configs.pkg

module.exports = log
