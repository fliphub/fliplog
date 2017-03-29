// @TODO:
// - [x] add debugFor filters here
// - [ ] more formatting
//  - [ ] easy table
//  - [x] json
// - [ ] storyline
// - [ ] docs
// - [x] emoji by name - checkout existing ones
// - [ ] integrate an existing validator
// - [ ] https://github.com/sindresorhus/boxen
// - [ ] https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-3-logger-interface.md

// http://stackoverflow.com/questions/26675055/nodejs-parse-process-stdout-to-a-variable
// https://github.com/ariya/phantomjs/issues/10980
// https://nodejs.org/api/process.html#process_process_stdout
// https://developer.mozilla.org/en-US/docs/Web/API/Console/table
// https://github.com/Automattic/cli-table
// const ansi = require('ansi')
// const cursor = ansi(process.stdout)
const path = require('path')
const chalk = require('chalk')
const clc = require('cli-color')
const {inspector} = require('inspector-gadget')
const toarr = require('to-arr')
const assignHidden = require('expose-hidden')
const ChainedMapExtendable = require('flipchain/ChainedMapExtendable.js')
const Chainable = require('flipchain/Chainable.js')
const Spinner = require('./Spinner')
const emojiByName = require('./emoji-by-name')
const shouldFilter = require('./filter')

// Stack trace format :
// https://github.com/v8/v8/wiki/Stack%20Trace%20API
let stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i
let stackReg2 = /at\s+()(.*):(\d*):(\d*)/i

// https://github.com/npm/npmlog
// http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
// http://www.100percentjs.com/best-way-debug-node-js/
// https://www.loggly.com/ultimate-guide/node-logging-basics/
// https://www.npmjs.com/package/cli-color
const clrs = [
  'black', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray',
]
const bgColors = [
  'bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite',
]
const em = [
  'italic', 'bold', 'underline',
]
const xtermByName = {
  colors: {
    'orange': 202,
  },
  bg: {
    'orange': 236,
  },
}
const psr3 = [
  'emergency',
  'alert',
  'critical',
  'error',
  'warning',
  'notice',
  'warning',
  'debug',
]

const combinations = clrs.concat(bgColors).concat(em)
let shh = false
let shushed = {}

// https://www.youtube.com/watch?v=SwSle66O5sU
const OFF = `${~315 >>> 3}@@`

// presets
function presetError(chain) {
  return chain.text('🚨  error:').color('bgRed.black').verbose(10)
}
function presetWarning(chain) {
  return chain.text('⚠  warning:').color('bgYellow.black').verbose(10)
}
function presetInfo(chain) {
  return chain.text('ℹ️️  info:').color('blue')
}
function presetNote(chain) {
  return chain.text('📋️  note:').color('dim')
}
function presetImportant(chain) {
  return chain.text('❗  important:').color('red.bold')
}

class LogChain extends ChainedMapExtendable {
  constructor(parent) {
    super(parent)
    this.extend([
      'track',
      'color',
      '_tags',
      '_data',
      '_xterm',
      '_text',
      '_shushed',
      'title',
      'diffs',
      '_filters',
      '_table',
      // 'presets',
    ])
    this.extendTrue([
      'space',
      'tosource',
      'time',
      'silent',
      '_verbose',
    ])

    this.presets = {}
    this.echo = this.log
    this.reset()

    // so it can be called with
    // `.catch(log.catch)`
    this.catch = this.catch.bind(this)
    this.handleParent(parent)

    const colorDecorators = {}
    combinations.forEach(color => {
      colorDecorators[color] = (text) => {
        return this.color(color).text(text)
      }
    })

    Object.assign(this, colorDecorators)
    return this
  }

  handleParent(parent) {
    this.from = super.from.bind(this)
    if (!parent || !(parent instanceof Chainable)) return
    const {_filters} = parent.entries()
    const {presets} = parent
    if (presets) this.presets = presets
    if (_filters) this._filters(_filters)
  }

  new(hardReset = false) {
    // if using hard reset, do not inherit
    const logChain = new LogChain(hardReset ? null : this)

    // so we can extend without reassigning function name
    delete logChain.name

    const logfn = (arg, text, color) => {
      return logChain.data(arg).text(text).color(color).verbose(10).echo()
    }

    assignHidden(logChain)
    Object.assign(logfn, logChain)
    return logfn
  }

  // ----------------------------- storing / capturing data ------------------
  // https://gist.github.com/pguillory/729616#gistcomment-332391
  saveLog(data, fileDescriptor) {
    this.fileDescriptor = fileDescriptor
    this.savedLog.push(data)
    return this
  }
  shush() {
    shh = true
    return this
  }
  unshush() {
    shh = false
    return this
  }
  startCapturing() {
    this.savedLog = []
    const saveLog = this.saveLog.bind(this)
    this.stdoutWriteRef = process.stdout.write
    process.stdout.write = (function(write) {
      return function(string, encoding, fileDescriptor) {
        saveLog(string, fileDescriptor)
        write.apply(process.stdout, arguments)
      }
    })(process.stdout.write)
    return this
  }
  stopCapturing() {
    process.stdout.write = this.stdoutWriteRef
    return this
  }

  // ----------------------------- differences ------------------

  table(head, data) {
    const Table = require('cli-table2')


    this.row = (row) => this.table.push(data)

    if (!data) {
      let table = new Table({head})
      this.table = table
      return this
    }

    let table = new Table({head})
    table.push(data)
    this.table = table
    return this.data(table.toString())
  }

  // credit to https://github.com/challenger532 for this
  // take in 2 things to diff
  // can pass in a diff1 and then call diff again to diff again
  diff() {
    const clone = require('lodash.clonedeep')
    const diffs = this.get('diffs')
    const args = Array.from(arguments).map((arg) => clone(arg))

    this.diffs(diffs.concat(args))
    return this
  }
  doDiff() {
    const Table = require('cli-table2')
    const deepDiff = require('deep-diff')
    const tosource = require('tosource')
    const colWidths = [200, 200, 200]

    const diffs = this.get('diffs')
    const diff = deepDiff(diffs.pop(), diffs.pop())
    // console.log(diff)

    const heads = diff.map(Object.keys)
    const datas = diff.map(Object.values)
    let tables = ''

    // console.log({heads, datas})
    for (const i in heads) {
      const head = heads[i]
      const data = datas[i].map((d) => tosource(d))
      // console.log({head, data})

      const table = new Table({
        head,
        // colWidths,
      })
      table.push(data)
      tables += table.toString()
    }
    return this.data(tables)
  }

  // ----------------------------- getting data ------------------

  returnVals() {
    const text = this.logText()
    const datas = this.logData()
    if (datas !== OFF && text !== OFF) return {text, datas}
    else if (datas !== OFF) return {datas}
    else if (text !== OFF) return {text}
    else return {text, datas}
  }
  return() {
    this._filter()
    const returnVals = this.returnVals()
    const entries = this.entries()
    this.reset()
    return Object.assign(entries, returnVals)
  }

  // ----------------------------- traces & stacks ------------------
  // https://www.npmjs.com/package/parsetrace
  // https://www.npmjs.com/package/debug-trace
  // https://blog.risingstack.com/node-js-logging-tutorial/
  // https://github.com/baryon/tracer
  // https://www.npmjs.com/package/callsite
  // http://www.devthought.com/2011/12/22/a-string-is-not-an-error/#beyond
  // https://github.com/baryon/tracer#log-file-transport

  trace() {
    const e = new Error('log.trace')
    let stacklist = e.stack.split('\n').slice(2)
    let s = stacklist[0]
    let data = {}
    let sp = stackReg.exec(s) || stackReg2.exec(s)
    if (sp && sp.length === 5) {
      data.method = sp[1]
      data.path = sp[2]
      data.line = sp[3]
      data.pos = sp[4]
      data.file = path.basename(data.path)
      data.stack = stacklist.map(stack => stack.replace(/\s+/, '')) // .join('\n')
      e.stack = data.stack
    }

    // we use inspector here so we do not reformat the error in verbose
    return this
      // .preset('error')
      .data(inspector(data))
      .echo()
  }
  stack() {
    if (!this.get('track')) return this
    this.trace()

    // get call stack, and analyze it
    // get all file,method and line number
    let stacklist = (new Error()).stack.split('\n').slice(4)
    let s = stacklist[0]
    let data = {}
    let sp = stackReg.exec(s) || stackReg2.exec(s)
    if (sp && sp.length === 5) {
      data.method = sp[1]
      data.path = sp[2]
      data.line = sp[3]
      data.pos = sp[4]
      data.file = path.basename(data.path)
      // data.stack = stacklist.join('\n')
    }

    console.log(inspector(data))
    return this
  }


  // ----------------------------- adding data ------------------

  // number, bool, or data
  verbose(data) {
    if (Number.isInteger(data)) {
      return this._verbose(data)
    } else if (typeof data === 'boolean') {
      return this._verbose(data)
    } else if (!data && data !== false) {
      return this._verbose(true)
    } else if (data === false) {
      return this._verbose(false)
    }

    return this.data(data)._verbose()
  }

  stringify(data, replacer = null, spacer = '  ', options = null) {
    const stringify = require('javascript-stringify')
    const prettified = stringify(data, replacer, spacer, options)
    return this.data(prettified)
  }
  json(data, opts = {}) {
    const defaults = {
      keysColor: 'blue',
      dashColor: 'yellow',
      stringColor: 'italic',
      numberColor: 'green',
    }
    opts = Object.assign(defaults, opts)

    const prettyjson = require('prettyjson')
    const prettified = prettyjson.render(data, opts)
    return this.data(prettified)
  }

  data(arg) {
    const args = Array.from(arguments)
    if (args.length === 1) {
      return this._data(arg)
    }
    return this._data(arguments)
  }
  text(text) {
    const title =  this.get('title') ? `${this.get('title')}` : ''
    this._text(title + text)
    return this
  }
  emoji(name) {
    return this.title(`${emojiByName(name)}  `)
  }
  addText(msg) {
    this.text(`${this.get('_text')} ${msg}`)
    return this
  }
  addPreset(name, preset) {
    this.presets[name] = preset
    return this
  }
  preset(names) {
    if (!Array.isArray(names)) names = [names]
    Object.keys(names).forEach(index => {
      const name = names[index]
      this.presets[name](this)
    })
    return this
  }

  // ----------------------------- resetting ------------------

  // @TODO:
  // wildcard, best using [] instead
  // use debugFor.js
  // enableTags, disableTags
  // handle keys here...
  filter(filters) {
    const filter = toarr(filters).concat(this.get('_filters'))
    this._filters(filter)
    return this
  }
  tags(names) {
    const tags = this.get('_tags')
    const updated = tags.concat(toarr(names))
    return this._tags(updated)
  }

  // check if the filters allow the tags
  _filter() {
    const tags = this.get('_tags')
    const filters = this.get('_filters')
    const should = shouldFilter({filters, tags})
    if (should) return this.silent(true)
    return this
    // console.log(tags, filters)
  }

  // ----------------------------- errors, catching, resetting ------------------

  error() {
    for (const arg of arguments) {
      this.new().preset('error').verbose(5).data(arg).echo()
    }
    return this
  }
  // just output
  just(data) {
    if (typeof data === 'string') this.text(data)
    else this.data(data)
    this.verbose(5)
    return this.log()
  }
  quick() {
    this.reset()
    return this.data(arguments).verbose().exit()
  }
  exit(log = true) {
    // this.trace()
    this.echo()
    this.reset()
    if (log) console.log('🛑  exit')
    process.exit()
  }
  catch() {
    this.error(arguments).exit(1)
  }

  reset() {
    // persist the time logging
    if (this.get('time')) {
      this.time(true)
    }
    this.time(false)

    this.diffs([])
    this.color('magenta')
    this.text('')
    this.title(false)
    this.data(null)
    this._table(false)
    this.tosource(false)
    this.verbose(10)
    this.space(false)
    this.silent(false)
    this._data(OFF)
    this._filters([])
    this._tags([])
    return this
  }
  clear() {
    process.stdout.write(clc.reset)
    return this
  }

  // ----------------------------- actual output ------------------

  log(data) {
    this.stack()
    this._filter()
    if (!data) data = this.get('_data')
    if (data === false) {
      this.reset()
      return this
    }

    if (shh === true) {
      // so we can have them on 1 line
      const text = this.logText()
      const datas = this.logData()
      shushed[Date.now] = {text, datas}
      this.shushed = shushed
      this.reset()
      return this
    }
    if (this.get('silent')) {
      this.reset()
      return this
    }

    // so we can have them on 1 line
    const text = this.logText()
    const datas = this.logData()

    if (datas !== OFF && text !== OFF) console.log(text, datas)
    else if (datas !== OFF) console.log(datas)
    else if (text !== OFF) console.log(text)
    else console.log(text, datas)

    this.logSpaces()
    this.reset()
    return this
  }

  logText() {
    let text = this.get('_text')
    text = this.getColored(text)
    text = this.getTime(text)

    if (!text) return OFF
    return text
  }
  logData() {
    let data = this.get('_data')
    if (data === OFF) return OFF

    data = this.getToSource(data)
    data = this.getVerbose(data)

    return data
  }
  logSpaces(msg) {
    const space = this.get('space')
    if (Number.isInteger(space)) console.log('\n'.repeat(space))
    if (space === true) console.log('\n\n\n')
    // else if (space !== undefined) console.log('\n')
    return msg
  }

  getColored(msg) {
    const logWrapFn = this.getLogWrapFn()
    if (this.get('_text')) return `${logWrapFn(msg)}`
    let text = logWrapFn(this.get('_text'))
    if (text) text += ':'
    return text
  }
  getLogWrapFn() {
    let logWrapFn = chalk
    const color = this.get('color')

    // maybe we colored with something not in chalk, like xterm
    if (typeof color === 'function') logWrapFn = color
    else if (color === false) logWrapFn = (msg) => msg
    else if (color.includes('.')) color.split('.').forEach((clr) => logWrapFn = logWrapFn[clr])
    else if (combinations.includes(color)) logWrapFn = logWrapFn[color]
    else if (logWrapFn[color]) logWrapFn = logWrapFn[color]
    return logWrapFn
  }
  getChalked(msg) {}

  xterm(color, bgColor) {
    if (typeof color === 'string' && color.includes('.')) {
      const colorArr = color.split('.')
      const txt = colorArr.shift()
      const bg = colorArr.pop()
      color = clc.xterm(txt).bgXterm(bg)
    }
    else if (color && bgColor) color = clc.xterm(color).bgXterm(bgColor)
    else if (Number.isInteger(color)) color = clc.xterm(color)
    else color = clc.xterm(202).bgXterm(236)

    return this.color(color)
  }

  getTime(msg) {
    if (this.get('time')) {
      const data = new Date()
      let hour = data.getHours()
      let min = data.getMinutes()
      let sec = data.getSeconds()
      let ms = data.getMilliseconds()
      hour = hour < 10 ? `0${hour}` : hour
      min = min < 10 ? `0${min}` : min
      sec = sec < 10 ? `0${sec}` : sec
      ms = ms < 10 ? `0${sec}` : ms
      return chalk.yellow(`${min}:${sec}:${ms}: `) + msg
    }
    return msg
  }

  getToSource(msg) {
    // typeof msg === 'object' &&
    if (this.get('tosource')) {
      const tosource = require('tosource')
      return tosource(msg)
    }
    return msg
  }
  getVerbose(msg) {
    const verbose = this.get('_verbose')
    if (typeof msg !== 'string' && verbose) {
      const PrettyError = require('pretty-error')
      let error = false
      if (msg && msg.stack) {
        const pe = new PrettyError()
        error = console.log(pe.render(msg))
        delete msg.stack
        try {
          const message = msg.message.split('\n')
          msg.message = message
        } catch (e) {
          // do nothing, likely logging a trace
        }
      }

      msg = inspector(msg, verbose)
    }
    return msg
  }


  // ----------------------------- spinner ------------------


  // @TODO: pr it to update examples...
  // https://www.npmjs.com/package/cli-spinner#demo
  // '<^>v'
  // '|/-\\'
  // spinner(message = 'flipping...', chars = )
  spinner(text = 'flipping...', opts = {}) {
    opts.text = text
    if (!opts.text.includes('%s')) opts.text = ' %s ' + text

    this.Spinner = new Spinner(opts)
    this.Spinner.start()

    // to go back to chaining
    this.Spinner.fliplog = () => this
    return this
  }
  stopSpinner(clear = false) {
    if (clear) this.clear()
    if (!this.Spinner) return this
    this.Spinner.stop(clear)
    delete this.Spinner
    return this
  }


  // ----------------------------- story ------------------

  // @TODO:
  story() {
    if (!this.mainStory) {
      const {mainStory} = require('storyboard')
      this.mainStory = mainStory
    }
    return this
  }
  child(title) {
    const story = this.mainStory.child({title})
    story.parent = this
    return story
  }
}

// ----------------------------- instantiate ------------------

const log = new LogChain().new()
log.addPreset('error', presetError)
log.addPreset('warning', presetWarning)
log.addPreset('info', presetInfo)
log.addPreset('note', presetNote)
log.addPreset('important', presetImportant)

module.exports = log
