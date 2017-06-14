const Chain = require('chain-able')
const {OFF} = require('../deps')
// const isNumber = require('chain-able/deps/is/number')
// const replaceLength = /\[length\]\: (\d+|(.*?)(?=,|\'|\]|\s+)?)\s+?/i

class Indent extends Chain {
  // increment
  indent(level) {
    if (level === 0) return this.set('indent', 0)
    return this.tap('indent', indent => indent + level)
  }
  // string repeat indent
  toString() {
    return ' '.repeat(this.get('indent'))
  }
  toNumber() {
    return this.get('indent')
  }
}

module.exports = {
  prettyformat(obj) {
    return this.formatter(arg => this.requirePkg('pretty-format')(arg)).data(
      obj
    )
  },
  fmtobj(obj) {
    return this.formatter(arg => this.requirePkg('fmt-obj')(arg)).data(obj)
  },
  indentStr(str) {
    if (!this.has('indent')) this.indent(0)
    const indent = this.get('indent')
    return indent.toString() + str
  },
  indent(level) {
    // if (!isNumber(level)) {}
    if (!this.has('indent')) {
      this.set('indent', new Indent(this))
    }
    this.get('indent').indent(level)
    return this
  },
  prettyobj(obj) {
    return this.formatter(arg => {
      const inspector = this.inspector()
      const strip = this.requirePkg('strip-ansi') || (x => x)
      return (
        this.inspectorGadget()
          .inspect(arg, 5, {showHidden: false})
          .split('\n')
          .map(data => this.indentStr(data))
          .filter(data => data)
          // .map(data => data.replace(replaceLength, ''))
          .map(data => (data.endsWith(',') ? data.slice(0, -1) : data))
          .map(data => data.replace(/[{}]/gim, ''))
          // .map(data => {
          //   console.log({data})
          //   return data
          // })
          .join('\n')
      )
    })
      // .set('textFormatter', text => {
      //   if (!text.endsWith('\n')) text += '\n'
      //   return text
      // })
      .data(obj)
  },
  prettysize(bytes) {
    const pretty = this.module('prettysize')(bytes)
    return this.text(pretty)
  },
  module(name) {
    return this.requirePkg(name)
  },

  /**
   * @since 0.4.0
   * @param  {Object} [obj=null] data
   * @param  {Object | null} [opts=null] options to pass into treeify
   * @return {FlipLog} @chainable
   */
  tree(obj = null, opts = null) {
    if (obj) this.data(obj)

    return this.formatter(data => {
      let arg = typeof opts === 'function' ?
        {lineCallback: opts, asLines: true} :
        opts
      const options = Object.assign(
        {
          asTree: true,
          asLines: false,
          showValues: true,
          hideFunctions: false,
          lineCallback: false,
          color: true,
        },
        arg
      )

      const {asLines, showValues, hideFunctions, lineCallback, color} = options
      const treeify = this.requirePkg('treeify')
      let result = asLines ?
        treeify.asLines(data, showValues, hideFunctions, lineCallback) :
        treeify.asTree(data, showValues, hideFunctions)

      // if (!this.get('text')) this.text('\n')
      // else this.text(this.get('text') + '\n\n')

      if (color && result && this.has('color')) {
        result = result
          .replace(/[├─│─┐└─]/gim, string => {
            const colored = this.getLogWrapFn()(string) // .replace(/undefined/, string)
            return colored
            // this.getColored(string)
          })
          .trim()
      }
      return result ? '\n' + result : OFF
    })
  },
}
