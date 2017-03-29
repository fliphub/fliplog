// @TODO: handle parsing cli such as `node eh --canada -- foo bar baz -- --cool io`

// https://www.npmjs.com/package/minimist
// https://npmcompare.com/compare/commander,minimist,nomnom,optimist,yargs
const timer = require('fliptime')
const argv = require('minimist')(process.argv.slice(2))
const nodeFlags = require('./node-flags')
const cache = Object.assign({}, {}, argv)
const IS = require('izz')
// const yargs = require('yargs')

const aliased = {

}
function aliasFor(flag) {
  if (flag.includes(',')) flag = flag.split(',').pop()
  const alias = false
  for (const key in aliased) {
    const aliasValues = aliased[key]
    if (aliasValues.includes(flag)) return key
  }
  return alias
}

function addAliases(aliases) {
  Object.assign(aliased, aliases)
}
function parseAliases(aliases) {
  if (Array.isArray(aliases)) {
    return aliases.forEach(parseAliases)
  } else if (aliases && typeof aliases === 'object') {
    return
  }

  // split for each one
  if (aliases.includes(',')) {
    aliases = aliases.replace(/\s\S/gmi, '').split(',')

    // last one is the name
    const alias = aliases[aliases.length - 1]
    addAliases({
      [alias]: aliases,
    })
  }
}

function searchAll(nEeDlE, options) {
  if (!options) options = {}

  if (nEeDlE && nEeDlE.includes(',')) {
    const possibleAlias = nEeDlE.split(',').pop()
    if (aliased[possibleAlias]) nEeDlE = possibleAlias
  }

  if (aliased[nEeDlE]) {
    const result = aliased[nEeDlE]
       .map((alias) => _searchAll(alias, options))
       .filter((value) => value)
       .pop()

    if (result) return result

    // const alias = aliasFor(nEeDlE)
    // if (alias) nEeDlE = alias
  }

  return _searchAll(nEeDlE, options)
}

function _searchAll(nEeDlE, options) {
  timer.start('flagger')
  if (!options) options = {}
  let value

  // console.log({aliased, nEeDlE, alias: aliased[nEeDlE]})
  // console.log('\n\n')

  const NEEDLE = nEeDlE.toUpperCase()
  const needle = nEeDlE.toLowerCase()
  options.needle = needle


  // log('0', {level: 'cache'})
  if (cache[needle]) return cache[needle]
  if (cache[NEEDLE]) return cache[NEEDLE]
  if (cache[nEeDlE]) return cache[nEeDlE]

  // log('1', {level: 'val'})
  value = val(nEeDlE, options) || val(needle, options) || val(NEEDLE, options)
  if (value) return realValue(value, options)

  // log('2', {level: 'get'})
  value = nodeFlags.get(nEeDlE) || nodeFlags.get(NEEDLE) || nodeFlags.get(needle)
  if (value) return realValue(value, options)

  // log('3', {level: 'env'})
  value = findIn(nEeDlE, process.env) || findIn(needle, process.env) || findIn(NEEDLE, process.env)
  if (value) return realValue(value, options)

  // log('4', {level: 'global'})
  value = findIn(nEeDlE, global) || findIn(needle, global) || findIn(NEEDLE, global)
  if (value) return realValue(value, options)

  // log('5', {level: 'argv minimalist'})
  if (argv[needle]) return argv[needle]

  // log('6', {level: 'fallback argv'})
  if (process.argv.includes(needle)) return true
  if (process.argv.includes(`--${needle}`)) return true
  if (process.argv.includes(`.env${needle}`)) return true

  // log('6', {level: 'fallback default'})
  if (options && options.default) return options.default
}

// used to export a callable fn obj
let flagger = searchAll

// searches through the commandline arguments
// check if it matches what we are searching for
// string or array later
function get(needle, options) {
  const defaults = {
    includeSlash: false,
  }
  options = Object.assign(defaults, options)
  const haystack = process.argv

  // console.log('SEARCH:', needle)
  for (let i = 0; i < haystack.length; i++) {
    const arg = haystack[i]
    if (!arg || !arg.includes) continue

    // because the location of the file being run is in the args
    if (!needle.includes('/') && !options.includeSlash && arg.includes('/')) {
      continue
    }

    if (arg.includes(needle) || needle.includes(arg)) {
      let argStripped = arg

      // remove prefixes
      if (arg.replace) argStripped = arg.replace('--', '').replace('env.', '')

      // check it
      if (argStripped.includes(needle) || needle.includes(argStripped)) {
        let argResult = argStripped
        // take value after `=`
        if (argStripped.includes && argStripped.includes('=')) argResult = argStripped.split('=').pop()

        // if it is an empty string
        // that is evaluated to false in a condition
        // if ('' === argStripped) return true
        // return argStripped

        // use result
        if (argResult === '') return true
        return argResult
      }
    }
  }

  // because webpack2 does not allow custom cli args
  if (!needle.includes('env')) return get(`env.${needle}`, haystack, options)

  return false
}

// @example
// --html --template=./demo/index.html
//
// argVal('template')
// -> argd
// -> --template=./demo/index.html
// -> template=./demo/index.html
// -> ./demo/index.html
//
function val(search, options) {
  const arg = get(search, options)
  if (arg === true) return true
  if (!arg) return false
  return arg
    .replace('--', '')
    .replace(search, '')
    .replace('env.', '')
    .replace('=', '')
}

// or hasOwnProperty?
// could be in other helper libs
function findIn(prop, obj) {
  if (obj[prop]) return obj[prop]
  return null
}

function findAll(flags, cb = false) {
  const found = {}
  const allStr = IS.arrOf(flags, IS.str)
  const allObj = IS.arrOf(flags, IS.obj)
  // ['ca', 'eu']
  if (allStr) {
    const names = flags
    flags = {}
    flags.names = names
  } else if (allObj) {
    return flags.forEach((flag) => findAll(flag, flag.cb || cb))
  }

  // names: [{flag: ['run'], type: 'bool', default: false}]
  for (let i = 0; i < flags.names.length; i++) {
    let flag = flags.names[i]
    const names = flag.flag || flag

    parseAliases(names)

    // flag: 'run', type: 'bool', default: false
    if (typeof flag === 'string') {
      // use alias key if it exists
      const alias = aliasFor(flag)
      if (alias) flag = alias

      // console.log({alias, flag, aliased}, flagger(flag))
      // console.log('\n\n\n')

      // add to object
      found[flag] = flagger(flag)
      continue
    }

    // 'run'
    if (typeof names === 'string') {
      found[names] = flagger(names, flag)
      continue
    }
    // flag: ['run'], type: 'bool', default: false
    if (IS.arr(names)) {
      names.forEach((sub) => {
        // use alias key if it exists
        const alias = aliasFor(sub)
        if (alias) sub = alias

        // add result to the object
        found[sub] = flagger(sub, flag)
      })
    }
  }

  // log
  //   .tags('flags')
  //   .title('🚩  built for flags')
  //   .color('italic')
  //   .data(found)
  //   .echo()

  // taylored for this specific environment
  // so if certain flags are added
  // there would be different properties
  if (cb) return cb(found)

  return found
}

function _realValue(value, options) {
  // console.log({value, options})
  if (options && options.type) {
    const type = options.type
    timer.stop('flagger')

    if (type === 'bool' || type === 'boolean') {
      if (value === 'true') return true
      if (value === 'false') return true
      if (typeof value === 'string') {
        if (value.includes('true')) return true
        if (value.includes('false')) return false
      }
      if (value == 'true') return true
      if (value == 'false') return false

      return Boolean(value)
    }

      // be more specific
    if (type === 'arr' || type === 'array') {
      if (value && value.includes) {
        if (value.includes(',')) return value.split(',')
        if (typeof value === 'string') return [value]
      } else {
        return [value]
      }
    }
  }

  if (Number.isInteger(value)) return value + 0
  if (value === 'true') return true
  if (value === 'false') return false
  if (typeof value === 'string') {
    if (value.includes('true')) return true
    if (value.includes('false')) return false
  }

  if (value == 'undefined') return undefined
  return value
}

// @TODO:
// - [ ] flush out
// - [x] bool
// - [x] default undefined
// - [ ] parse str
// - [ ] safety to array
function realValue(value, opts) {
  const {needle} = opts
  const val = _realValue(value, opts)
  cache[needle] = val
  return val
}

function decorate(obj = {}, flag, opts = {override: true}) {
  const {override} = opts
  const name = Object.keys(flag)[0]
  const val = flag[name]
  const valIsReal = val != undefined
  const valNotOnContext = (obj[name] == undefined)
  const valIsRealAndNotOnContext = valIsReal && valNotOnContext
  if (override || valIsRealAndNotOnContext) obj[name] = val
  return obj
}
decorate.obj = function(obj) {
  return decorate.bind(null, obj)
}

function findAndDecorate(flags, obj, opts = {override: true}) {
  return decorate(obj, flags, opts)
}

const flaggerObj = {
  aliased,
  addAliases,
  parseAliases,

  findAndDecorate,
  decorate,
  findAll,

  // @TODO: should be lowercasing props when checking
  searchAll,
  val,
  get,
  argv,
  // yargs,
}

// @TODO:
// - [ ] optimize
// - [ ] respect options for which vals to search through
flagger = Object.assign(flagger, flaggerObj)

module.exports = flagger
