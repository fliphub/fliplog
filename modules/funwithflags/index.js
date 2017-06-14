/* eslint max-lines: ["error", 700] */
/* eslint complexity: "off" */
const {isNum, hasKey, camelCaseKeys} = require('./utils')

/**
 * @prop {Array<string>} args
 * @prop {Object} aliases
 * @prop {Array<string>} notFlags used by var
 * @prop {boolean} _stopEarly `.stopEarly`
 * @prop {boolean} wantsDD using `--` in `.dd`
 * @prop {boolean} wantsCamel
 * @prop {boolean} [allBools = false]
 * @prop {boolean} vars use variable arguments as dashed options
 * @prop {Object} argv={_: []}
 * @prop {Function} [unknownFn]
 * @prop {Object} [_defaults] `.defaults`
 * @prop {Object} bools values to treat as booleans
 * @prop {Object} string values to treat as strings
 * @prop {number} i current index to move forward and skip in loops
 */
class FunWithFlags {
  constructor() {
    this.argv = {_: []}
    this.notFlags = []
    this.aliases = {}

    this.allBools = false
    this.bools = {}
    this.string = {}
    this._defaults = {}
    this.unknownFn = null
  }

  // --- opts ---

  /**
   * @desc stop at the first `--`
   * @param {boolean} [_stopEarly=true]
   * @return {FunWithFlags} @chainable
   */
  stopEarly(_stopEarly = true) {
    this._stopEarly = _stopEarly
    return this
  }

  /**
   * @example
   *  ['globbing', "'**'"] -> ['--globbing', "'**'"]
   *  ['noflag=flag'] -> ['--noflag=', 'flag']
   *
   *  can be done with allbools as well
   *  ['noflag', 'flag'] -> ['--noflag', '--flag'],
   *
   * @desc allow arguments without dashes to be treated automatically as --
   * @param {boolean} [vars=true]
   * @return {FunWithFlags} @chainable
   */
  allowVars(vars = true) {
    this.vars = vars
    return this
  }

  /**
   * @aka '--'
   * @desc doubledash: include args after -- in object rather than ._
   * @param {boolean} [wantsDD=true]
   * @return {FunWithFlags} @chainable
   */
  dd(wantsDD = true) {
    this.wantsDD = wantsDD
    return this
  }

  /**
   * @desc delete the ._
   * @param {boolean} [wantsU=true]
   * @return {FunWithFlags} @chainable
   */
  underscore(wantsU = false) {
    this.wantsU = wantsU
    return this
  }

  /**
   * @desc return camelCasedKeys (helpful when destructuring)
   * @param {boolean} [wantsCamel=true]
   * @return {FunWithFlags} @chainable
   */
  camelCase(wantsCamel = true) {
    this.wantsCamel = wantsCamel
    return this
  }

  /**
   * @desc fallback to these when values aren't passed in
   * @param  {Object} [defaults={}] fallback values
   * @return {FunWithFlags} @chainable
   */
  defaults(defaults = {}) {
    this._defaults = defaults
    return this
  }

  /**
   * @param  {Array<string>} args
   * @return {FunWithFlags} @chainable
   */
  arg(args) {
    if (this.vars === true) {
      args = args.map(arg => {
        // ensure it is only letters, dashes, equals, period, or numbers
        // from beginning to end
        if (/(^[A-Za-z=-_.]+$)/.test(arg)) return '--' + arg
        return arg
      })
    }

    this.args = args

    // eslint-disable-next-line prefer-includes/prefer-includes
    const ddIndex = args.indexOf('--')

    // @TODO: should .split
    if (ddIndex !== -1) {
      this.notFlags = args.slice(ddIndex + 1)
      this.args = args.slice(0, ddIndex)
    }

    return this
  }

  /**
   * @param  {Function} [fn=null]
   * @return {FunWithFlags} @chainable
   */
  unknown(fn = null) {
    this.unknownFn = fn

    return this
  }

  /**
   * @TODO example input and output
   * @param  {Object} [alias={}]
   * @return {FunWithFlags}
   */
  alias(alias = {}) {
    const aliases = this.aliases

    // go through alias
    const keys = Object.keys(alias)
    for (let k = 0; k < keys.length; k++) {
      const key = keys[k]

      // make into arr, take from user alias into object alias
      aliases[key] = [].concat(alias[key])

      // go through that array
      for (let kk = 0; kk < aliases[key].length; kk++) {
        const x = aliases[key][kk]
        aliases[x] = [key].concat(aliases[key].filter(y => x !== y))
      }
    }

    return this
  }

  // --- building ---

  /**
   * @protected
   * @param  {string} key
   * @param  {string} arg
   * @return {boolean}
   */
  argDefined(key, arg) {
    const {aliases, string, allBools, bools} = this

    return (
      (allBools && (/^--[^=]+$/).test(arg)) ||
      string[key] ||
      bools[key] ||
      aliases[key]
    )
  }

  /**
   * @param {Object} obj
   * @param {Array} keys
   * @param {*} value
   * @return {FunWithFlags} @chainable
   */
  setKey(obj, keys, value) {
    const {bools} = this
    let o = obj
    let key = keys[keys.length - 1]

    const mostKeys = keys.slice(0, -1)

    for (let i = 0; i < mostKeys.length; i++) {
      const k = mostKeys[i]
      if (o[k] === undefined) o[k] = {}
      o = o[k]
    }

    // require('fliplog')
    //   .red('setKey')
    //   .data({obj, keys, value, mostKeys, key})
    //   // .trace()
    //   .echo()

    if (o[key] === undefined || bools[key] || typeof o[key] === 'boolean') {
      o[key] = value
    }
    else if (Array.isArray(o[key]) === true) {
      o[key].push(value)
    }
    else {
      o[key] = [o[key], value]
    }

    return this
  }

  /**
   * @protected
   * @param {string} key
   * @param {string} val
   * @param {string} arg
   * @return {FunWithFlags} @chainable
   */
  setArg(key, val, arg) {
    const {unknownFn, argv, aliases} = this

    if (arg && unknownFn && !this.argDefined(key, arg)) {
      if (unknownFn(arg, this) === false) return this
    }

    var value = val
    if (!this.string[key] && isNum(val) === true) {
      value = Number(val)
    }

    // require('fliplog')
    //   .yellow('setArg')
    //   .data({key, val, arg, value, alias: aliases[key]})
    //   .echo()

    this.setKey(argv, key.split('.'), value)

    if (aliases[key] === undefined || Array.isArray(aliases[key]) === false) {
      return this
    }

    for (let a = 0; a < aliases[key].length; a++) {
      this.setKey(argv, aliases[key][a].split('.'), value)
    }

    return this
  }

  // --- types, default ---

  /**
   * @param  {string} key
   * @return {boolean}
   */
  aliasIsBoolean(key) {
    return this.aliases[key].some(x => this.bools[x])
  }

  /**
   * @TODO optimize
   * @desc   ensure specific types of args
   * @param  {Array | string | boolean | null} string
   * @param  {Array | string | boolean | null} bools
   * @return {FunWithFlags} @chainable
   */
  types(string = null, bools = null) {
    const {aliases} = this

    if (string !== null) {
      [].concat(string).filter(Boolean).forEach(key => {
        this.string[key] = true
        if (aliases[key]) {
          this.string[aliases[key]] = true
        }
      })
    }

    if (bools !== null) {
      if (typeof bools === 'boolean' && bools === true) {
        this.allBools = true
      }
      else {
        // minimist l#47 merged loops
        // @TODO toarr
        [].concat(bools).filter(Boolean).forEach(key => {
          this.bools[key] = true
          if (this._defaults[key] === undefined) this.setArg(key, false)
          else this.arg(key, this._defaults[key])
        })
      }
    }

    return this
  }

  // --- parsing ---

  /**
   * @protected
   * @param  {string} arg
   * @return {FunWithFlags} @chainable
   */
  handleDoubleDashEq(arg) {
    // Using [\s\S] instead of . because js doesn't support the
    // 'dotall' regex modifier. See:
    // http://stackoverflow.com/a/1068308/13216
    var m = arg.match(/^--([^=]+)=([\s\S]*)$/)
    var key = m[1]
    var value = m[2]

    if (this.bools[key]) value = value !== 'false'

    this.setArg(key, value, arg)

    return this
  }

  /**
   * @param  {string} arg
   * @return {FunWithFlags} @chainable
   */
  handleNo(arg) {
    var key = arg.match(/^--no-(.+)/)[1]
    this.setArg(key, false, arg)
    return this
  }

  /**
   * @protected
   * @param  {string} arg
   * @return {FunWithFlags} @chainable
   */
  handleDoubleDash(arg) {
    const {args, string, aliases, bools, allBools} = this
    const key = arg.match(/^--(.+)/)[1]
    const next = args[this.i + 1]

    if (
      next !== undefined &&
      !(/^-/).test(next) &&
      !bools[key] &&
      !allBools &&
      (aliases[key] ? !this.aliasIsBoolean(key) : true)
    ) {
      // console.log('handleDoubleDash first condition satisfied')
      // console.log(key, next, arg)
      this.setArg(key, next, arg)
      this.i++
    }
    else if (/^(true|false)$/.test(next)) {
      // console.log('handleDoubleDash second condition satisfied: boolean')
      // console.log(key, next, arg)
      this.setArg(key, next === 'true', arg)
      this.i++
    }
    else {
      // console.log('handleDoubleDash third: fallback')
      // console.log(key, next, arg)
      this.setArg(key, string[key] ? '' : true, arg)
    }

    return this
  }

  /**
   * @protected
   * @desc breaks letters into long, checks against aliases, breaks if needed
   * @param  {string} arg
   * @return {boolean} should break or not (if stop early)
   */
  break(arg) {
    const {string} = this
    const letters = arg.slice(1, -1).split('')

    for (var j = 0; j < letters.length; j++) {
      var next = arg.slice(j + 2)

      if (next === '-') {
        this.setArg(letters[j], next, arg)
        continue
      }

      // when letters and `=`
      // eslint-disable-next-line
      if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
        this.setArg(letters[j], next.split('=')[1], arg)
        return true
      }

      // when letters and then numbers
      if (/[A-Za-z]/.test(letters[j]) && (/-?\d+(\.\d*)?(e-?\d+)?$/).test(next)) {
        this.setArg(letters[j], next, arg)
        return true
      }

      // when letters and the next arg has whitespace
      if (letters[j + 1] && letters[j + 1].match(/\W/)) {
        this.setArg(letters[j], arg.slice(j + 2), arg)
        return true
      }
      else {
        // fallback
        this.setArg(letters[j], string[letters[j]] ? '' : true, arg)
      }
    }

    return false
  }

  /**
   * @protected
   * @desc single dash arg to double
   * @param  {string} arg
   * @return {FunWithFlags} @chainable
   */
  handleSingle(arg) {
    const {bools, string, args, aliases} = this
    const broken = this.break(arg)

    // get the next character
    const key = arg.slice(-1)[0]

    // when the next character is not a flag and not broken
    if (broken === false && key !== '-') {
      // current arg
      const argc = args[this.i + 1]

      /**
       * @desc when dashed & when alias exists and it aint a boolean
       * @example
       *    matches: '--1' from '--10'
       *    matches: '--e' from '--eh'
       */
      if (
        argc &&
        !(/^(-|--)[^-]/).test(argc) &&
        !bools[key] &&
        (aliases[key] ? !this.aliasIsBoolean(key) : true)
      ) {
        this.setArg(key, argc, arg)
        this.i++
      }
      else if (argc && (/true|false/).test(argc)) {
        this.setArg(key, argc === 'true', arg)
        this.i++
      }
      else {
        this.setArg(key, string[key] ? '' : true, arg)
      }
    }

    return this
  }

  /**
   * @protected
   * @param  {string} arg
   * @return {boolean} whether to break
   */
  handleFallback(arg) {
    const {_stopEarly, argv, args, unknownFn, string} = this

    // if it has not been set,
    // or set to false,
    // or set to fn that returns false
    if (!unknownFn || unknownFn(arg, this) !== false) {
      argv._.push(string._ || !isNum(arg) ? arg : Number(arg))
    }
    if (_stopEarly === true) {
      argv._.push.apply(argv._, args.slice(this.i + 1))
      return false
    }
    return true
  }

  /**
   * @desc go through the args, call the handlers
   * @see FunWithFlags.handleDoubleDashEq
   * @see FunWithFlags.handleNo
   * @see FunWithFlags.handleDoubleDash
   * @see FunWithFlags.handleSingle
   * @see FunWithFlags.handleFallback
   * @see FunWithFlags.finish, FunWithFlags.i, FunWithFlags.args
   * @return {FunWithFlags} @chainable FunWithFlags.finish
   */
  parse() {
    const {args} = this
    this.i = 0

    for (let i = this.i; this.i < args.length; this.i++) {
      let arg = args[this.i]

      if (/^--.+=/.test(arg)) {
        // console.log({arg}, 'dd=')
        this.handleDoubleDashEq(arg)
      }
      else if (/^--no-.+/.test(arg)) {
        // console.log({arg}, 'no')
        this.handleNo(arg)
      }
      else if (/^--.+/.test(arg)) {
        // console.log({arg}, 'dd')
        this.handleDoubleDash(arg)
      }
      else if (/^-[^-]+/.test(arg)) {
        // console.log({arg}, 'd')
        this.handleSingle(arg)
      }
      else {
        // console.log({arg}, 'u')
        // eslint-disable-next-line
        if (this.handleFallback(arg) === false) break
      }
    }

    return this.finish()
  }

  /**
   * @return {FunWithFlags} @chainable
   */
  finish() {
    const {_defaults, argv, aliases, notFlags, wantsDD, wantsCamel} = this
    // require('fliplog').red('defaults no key ').data(_defaults).echo()

    if (_defaults !== undefined) {
      const dKeys = Object.keys(_defaults)
      for (let d = 0; d < dKeys.length; d++) {
        const key = dKeys[d]
        // require('fliplog').blue('defaults ' + key).data(_defaults[key]).echo()
        // require('fliplog').verbose().data(_defaults[key]).echo()

        if (hasKey(argv, key.split('.')) === false) {
          const val = _defaults[key]

          // require('fliplog')
          //  .blue('defaults no key ' + key)
          //  .data({val, argv})
          //  .echo()

          this.setKey(argv, key.split('.'), val)

          if (aliases[key]) {
            aliases[key].forEach(x => this.setKey(argv, x.split('.'), val))
          }
        }
      }
    }

    if (wantsDD === true) argv['--'] = []
    // require('fliplog').quick(notFlags)
    for (let f = 0; f < notFlags.length; f++) {
      const flag = notFlags[f]
      if (wantsDD === true) argv['--'].push(flag)
      else if (argv._.includes(flag) === false) argv._.push(flag)
    }

    if (this.wantsCamel === true) {
      this.argv = camelCaseKeys(argv)
    }
    if (this.wantsU === false) {
      this._ = argv._
      delete argv._
    }

    return this
  }
}

/**
 * @param  {Array | string | null} [argv=null] process.argv.slice(2)
 * @param  {Object | boolean | null} [opts=null] options
 * @return {FunWithFlags | Object} parsed arguments
 */
function fwf(argv = null, opts = null) {
  const fun = new FunWithFlags()

  if (argv === null) {
    return fun
  }
  if (opts === null) {
    return fun.arg(argv).parse().argv
  }
  if (opts === true) {
    const arg = fun.arg(argv)
    return arg
  }

  if (opts.unknown !== undefined) {
    fun.unknown(opts.unknown)
  }
  if (opts.alias !== undefined) {
    fun.alias(opts.alias)
  }
  if (opts.default !== undefined) {
    fun.defaults(opts.default)
  }
  if (opts.boolean !== undefined || opts.string !== undefined) {
    fun.types(opts.string, opts.boolean)
  }
  if (opts['--'] !== undefined) {
    fun.dd()
  }
  if (opts.stopEarly !== undefined) {
    fun.stopEarly()
  }
  if (opts.vars !== undefined) {
    fun.allowVars() // .arg(argv).parse()
  }
  if (opts.camel !== undefined) {
    fun.camelCase(opts.camel)
  }
  if (opts.underscore !== undefined) {
    fun.underscore(opts.underscore)
  }

  if (opts.obj !== undefined) {
    return fun.arg(argv).parse()
  }

  return fun.arg(argv).parse().argv
}

/**
 * @desc allows using default process.argv.slice(2)
 * @param {Object | boolean | null} [opts=null] options
 * @return {Object} parsed arguments
 */
fwf.argv = function fwfArgv(opts = null) {
  return fwf(process.argv.slice(2), opts)
}

fwf.fwf = fwf
fwf.FunWithFlags = FunWithFlags
fwf.default = fwf
fwf.version = '1.0.2'

module.exports = fwf
