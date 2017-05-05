module.exports = {
  deps: {
    'lodash.clonedeep': '4.5.0',
    'cli-table2': '0.2.0',
    'tosource': '0.2.0',
    'deep-diff': '0.3.4',
  },

  reset() {
    this.delete('diffs')

    return this
  },

  /**
   * @desc
   *  take in 2 things to diff
   *  can pass in a diff1 and then call diff again to diff again
   *
   * @author https://github.com/challenger532 for this
   * @return {FlipLog} @chainable
   */
  diff() {
    const clone = require('lodash.clonedeep') // eslint-disable-line

    if (this.has('diffs') === false) {
      this.set('diffs', [])
    }

    const diffs = this.get('diffs')
    const args = Array.from(arguments).map(arg => clone(arg))

    return this.set('diffs', diffs.concat(args))
  },

  /**
   * @see FlipLog.diff
   * @tutorial https://github.com/fliphub/fliplog/blob/master/README.md#%EF%B8%8F-diff
   * @return {string} table of diffs
   */
  diffs() {
    const Table = require('cli-table2')
    const deepDiff = require('deep-diff')
    const tosource = require('tosource')
    const colWidths = [200, 200, 200]

    const _diffs = this.get('_diffs')
    const diff = deepDiff(_diffs.pop(), _diffs.pop())

    if (!diff) return this.data('no diff')
    const heads = diff.map(Object.keys)
    const datas = diff.map(Object.values)
    let tables = ''

    // console.log({heads, datas})
    for (const i in heads) {
      const head = heads[i]
      const data = datas[i].map(d => tosource(d))
      // console.log({head, data})

      const table = new Table({
        head,
        // colWidths,
      })
      table.push(data)
      tables += table.toString()
    }

    return this.data(tables)
  },
}
