let toarr
let shouldFilter
let matcher

const isNumber = obj =>
  Object.prototype.toString.call(obj) === '[object Number]' ||
  (/^0x[0-9a-f]+$/i).test(obj) ||
  (/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/).test(obj)

const stripSpaces = str => str.replace(/([\s\t\n\r ])*/gim, '')
const stripSymbols = str => str.replace(/[><=]/gim, '')
const levelFilterRegExp = /[><=]\d+/
const isLogLevel = str => str && levelFilterRegExp.test(str)

const levelFactory = filter => {
  const num = stripSymbols(filter)
  if (filter.includes('<=')) return lv => lv <= num
  else if (filter.includes('>=')) return lv => lv >= num
  else if (filter.includes('>')) return lv => lv > num
  else if (filter.includes('<')) return lv => lv < num
  else if (filter.includes('=')) return lv => lv == num
  else
    return lv => {
      throw new Error('invalid filter')
    }
}

const filterLevelFactory = filter => {
  const levelMatcher = levelFactory(filter)

  // @TODO: add a way to enforce level tagging
  // @TODO: if ONLY checking level, could be more optimized
  // @TODO: unsure if level needs to be diff from tags...
  return entries => {
    // spread, add safety
    let {level, tags, namespace} = entries
    let nums = tags || []

    // merge level, filter numbers
    if (level !== undefined) nums.push(level)
    nums = nums.filter(isNumber)

    // console.log({level, tags, nums})

    if (nums.length) {
      const passing = nums.filter(levelMatcher)
      // console.log({passing})
      if (!passing.length) return false
    }

    return true
  }
}

const filterMatcherFactory = filter => {
  if (!matcher) matcher = require('../deps/matcher')

  const matchFn = matcher.map(filter)
  return entries => {
    let {level, tags, namespace} = entries
    let input = tags || []
    if (level !== undefined) input.push(level)

    const matches = matcher(input, matchFn)
    // @TODO: reason for matching internalActivityLog here

    if (matches.length === 0) return false
    return true
  }
}

// could also be named abstractFilterFactory
const filterFactory = filter => {
  if (typeof filter === 'string') {
    // console.log('is string')
    const stripped = stripSpaces(filter)
    // console.log({stripped})
    if (isLogLevel(stripped)) {
      return filterLevelFactory(stripSpaces(filter))
    }
  }

  // just using a single function, allow full access?
  if (typeof filter === 'function') {
    return filter
  }

  return filterMatcherFactory(filter)

  // return isMatchCurry(toarr(filter))
}

// https://github.com/visionmedia/debug#wildcards
// DEBUG=''

module.exports = chain => {
  chain.lvl = _level => chain.level(_level)
  chain.tag = _tags => chain.tags(_tags)
  chain.ns = _namespace => chain.namespace(_namespace)
  chain.set('filterer', args => {
    if (!shouldFilter) shouldFilter = require('../deps/filter')
    return shouldFilter(args)
  })

  const plugin = {
    reset() {
      this.delete('tags')
    },

    /**
     * @TODO: filter with prop like
     * .filterWith('prop', prop => )...
     *
     * @TODO: this and weights
     * @see weights
     * @desc set levels for namespaces
     * @param {Object} namespaces
     * @type {FlipLog} @chainable
     */
    // namespaces(namespaces) {},
    // namespace(namespace) {
    //   return this.set('namespace', namespace)
    // },

    /**
     * @alias lvl
     * @since 0.4.0
     * @param  {number} level
     * @return {[type]}
     */
    level(level) {
      return this.set('level', level).tags(level)
    },

    /**
     * @TODO
     * - [ ] wildcard, best using [] instead
     * - [ ] use debugFor.js
     * - [ ] enableTags, disableTags
     * - [ ] handle keys here...
     *
     *  {boolean} [verbose=true] if disabled & only a fn is passed as first param, only tags are returned
     *
     * @since 0.1.0
     * @tutorial https://github.com/fliphub/fliplog/blob/master/README.md#-filtering
     * @param {string | Array<string> | Function} filters filter white or black flags
     * @return {FlipLog} @chainable
     */
    filter(filters) {
      toarr = toarr ? toarr : require('chain-able/deps/to-arr')
      const filter = filterFactory(filters)
      const merged = toarr(filter).concat(this.get('filter') || [])

      // would need a double tap...
      // this.tap('filter', existing => existing || [])
      return this.set('filter', merged)
    },

    /**
     * @alias tag
     * @since 0.1.0
     * @desc tag the log for filtering when needed
     * @param {string | Array<string>} names tags to use
     * @return {FlipLog} @chainable
     */
    tags(names) {
      toarr = toarr ? toarr : require('chain-able/deps/to-arr')
      const tags = this.get('tags') || []
      const updated = tags.concat(toarr(names))
      return this.set('tags', updated)
    },

    /**
     * @protected
     * @since 0.1.0
     * @desc check if the filters allow the tags
     * @return {FlipLog} @chainable
     */
    _filter() {
      const filterer = this.get('filterer')
      const tags = this.get('tags') || []
      const filters = this.get('filter') || []
      const should = filterer.call(this, {filters, tags, instance: this})
      if (should) return this.silent(true)
      return this
      // console.log(tags, filters)
    },
  }

  return plugin
}
