let index = 0
const debugs = {}

function tagPasses(tags, filter, not) {
  if (tags.length === 0) return true

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]
    const includes = filter.includes(tag)
    debugs[index].tags.push({tag, i, not, includes})

    if (not && includes) return false
    // @TODO: later if only whitelisting...
    if (includes) return true
  }

  return true
}

function shouldFilter({filters, tags, checkTags}) {
  const hasStarFilter = filters.includes('*')
  const hasSilentFilter = filters.includes('silent')
  debugs[index].filters.push({hasStarFilter, hasSilentFilter})

  if (hasStarFilter) return false
  if (hasSilentFilter) return true

  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i]
    let not = filter.includes('!')

    // @TODO: later, for arithmetics
    // if (filter.includes('&')) {
    //   const silent = filter
    //     .split('&')
    //     .map((tag) => this._filterTagsByFilter(filter, not))
    //     .filter((tag) => tag === false)
    //     .length === filter.split('&').length
    //
    //   if (silent) return this.silent(true)
    // }

    const shouldFilterTag = checkTags(filter, not)
    debugs[index].filters.push({not, filter, shouldFilterTag})

    if (shouldFilterTag === false) return true
  }

  return false
}

/**
 * @param  {Array<string>} filters filters to check
 * @param  {Array<string>} tags tags to check
 * @return {boolean}
 */
function tagAndFilters({filters, tags}) {
  // setup debug values for later
  index = index + 1
  debugs[index] = {
    filters: [],
    tags: [],
  }

  // bind the tags to the first arg
  const checkTags = tagPasses.bind(null, tags)

  // check whether we should filter
  return shouldFilter({checkTags, filters})
}

tagAndFilters.debugs = debugs

module.exports = tagAndFilters
