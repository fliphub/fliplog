let toarr
let shouldFilter

module.exports = {
  reset() {
    this.delete('tags')
  },

  // @TODO:
  // wildcard, best using [] instead
  // use debugFor.js
  // enableTags, disableTags
  // handle keys here...
  filter(filters) {
    toarr = toarr ? toarr : require('to-arr')
    const filter = toarr(filters).concat(this.get('filters') || [])
    return this.set('filter', filter)
  },
  tags(names) {
    toarr = toarr ? toarr : require('to-arr')
    const tags = this.get('tags') || []
    const updated = tags.concat(toarr(names))
    return this.set('tags', updated)
  },

  // check if the filters allow the tags
  _filter() {
    shouldFilter = shouldFilter ? shouldFilter : require('../deps/filter')

    const tags = this.get('tags') || []
    const filters = this.get('filter') || []
    const should = shouldFilter({filters, tags, instance: this})
    if (should) return this.silent(true)
    return this
    // console.log(tags, filters)
  },
}
