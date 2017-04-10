// @TODO:
// - [x] add debugFor filters here
// - [ ] more formatting
//  - [ ] easy table
//  - [x] json
// - [ ] storyline
// - [ ] docs
// - [x] emoji by name - checkout existing ones
// - [ ] integrate an existing validator
// - [ ] https://www.npmjs.com/package/boxen
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
const fliptime = require('fliptime')
const clc = require('cli-color')
const {inspector} = require('inspector-gadget')
const toarr = require('to-arr')
const expose = require('expose-hidden')
const ChainedMapExtendable = require('flipchain/ChainedMapExtendable.js')
const Chainable = require('flipchain/Chainable.js')
const Spinner = require('./Spinner')
const emojiByName = require('./emoji-by-name')
const shouldFilter = require('./filter')
// Stack trace format :
// https://github.com/v8/v8/wiki/Stack%20Trace%20API
let stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i
let stackReg2 = /at\s+()(.*):(\d*):(\d*)/i

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function shuffle(a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]]
  }
  return a
}
function chance() {
  return random(0, 10) > 5
}

// https://github.com/npm/npmlog
// http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
// http://www.100percentjs.com/best-way-debug-node-js/
// https://www.loggly.com/ultimate-guide/node-logging-basics/
// https://www.npmjs.com/package/cli-color
const clrs = [
  'black', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray', 'red',
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
      '_diffs',
      '_filters',
      '_table',
      'highlighter',
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
    this.log = this.echo
    this.doDiff = this.diffs.bind(this)
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

    expose(logChain)
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
  startCapturing(output = false) {
    const saveLog = this.saveLog.bind(this)
    this.stdoutWriteRef = process.stdout.write
    process.stdout.write = (function(write) {
      return function(string, encoding, fileDescriptor) {
        saveLog(string, fileDescriptor)
        // write.apply(process.stdout, arguments)
      }
    })(process.stdout.write)
    return this
  }
  stopCapturing() {
    process.stdout.write = this.stdoutWriteRef
    return this
  }

  // ------- fun -----
  boxStyles(styles = {padding: 1, margin: 1, borderStyle: 'double', default: true}) {
    this.set('boxStyles', styles)
    return this
  }
  box(input, options, echo = false) {
    const boxen = require('boxen')
    options = options || this.get('boxStyles')
    const box = boxen(input, options)

    if (options && options.default === true) {
      this.text(box)
    } else {
      this.data(box)
    }

    if (echo) return this.echo()
    return this
  }
  // https://github.com/mikaelbr/node-notifier
  // alias as notification/notify
  notify(options, msg = null, echo = false) {
    const notifier = require('node-notifier')

    if (typeof options === 'string' && typeof msg === 'string' && echo === true) {
      notifier.notify({
        'title': options,
        'message': msg,
      })
    } else if (typeof options === 'string' && msg === true) {
      notifier.notify(options)
    } else if (echo === true) {
      notifier.notify(options)
    } else {
      return this._data({
        inspect() {
          notifier.notify(options)
          return ''
        },
      })
    }

    return this
  }

  // @TODO:
  // - [ ] do not echo right away
  // - [ ] https://www.npmjs.com/package/node-progress-bars
  progress(total = 20, cb = null, interval = 100) {
    if (!process.stdout.isTTY) return this
    const ProgressBar = require('progress')

    if (typeof total === 'string' &&
        typeof cb === 'object') {
      this.progressBar = new ProgressBar(total, cb)
      if (typeof interval === 'function') {
        interval(this.progressBar)
      }
      return this
    }

    if (cb === null) {
      cb = (bar) => {
        bar.tick()
        if (bar.complete) clearInterval(this.progressCb)
      }
    }

    this.progressBar = new ProgressBar('  ╢:bar╟', {
      // complete: green,
      // incomplete: red,
      total,
      complete: '█',
      incomplete: '░',
      clear: true,

      // terminal columns - package name length - additional characters length
      width: (process.stdout.columns || 100) - 50 - 3,
    })

    if (interval) {
      this.progressCb = setInterval(() => cb(this.progressBar, this.progressCb), interval)
    } else {
      this.progressCb = cb(this.progressBar)
    }

    // this.progress = new Progress().init(100)
    return this
  }

  sparkly(input = null, options = null) {
    if (input === null) {
      // order from random
      input = [
        [0, 3, 5, 8, 4, 3, 4, 10],
        [1, 2, 3, 4, 5, 6, 7, 8],
        [1, 2, 3, 4, 5, 6, 7, 8],
        [1, 18, 9, 4, 10],
      ]
      input = shuffle(input).pop()
    }

    if (options === null && chance()) {
      options = {style: 'fire'}
    }

    const sparkly = require('sparkly')
    this._data(sparkly(input, options))
    return this
  }

  barStyles(styles = {
    color: 'green',
    width: 40,
    height: 10,
    maxY: 10,
    yFractions: 1,
  }) {
    return this.set('barStyles', styles)
  }
  // https://github.com/substack/node-charm
  // https://www.npmjs.com/package/cli-chart
  bar(input = null, styles, echo = false) {
    styles = styles || this.get('barStyles')
    if (input === null) {
      input = [
        [0, random(1, 10)],
        [1, random(0, 20)],
        [2, random(1, 5)],
        [3, random(0, 1)],
        [4, random(0, 15)],
      ]
    }
    const babar = require('babar')
    const data = babar(input, styles)
    return this._data(data)
  }
  list() {
    const listr = require('listr')
    return this
  }
  beep(sequence = 3, echo = false) {
    const beep = require('beeper')
    const data = {
      inspect() {
        beep(sequence)
        return 'beeping! '
      },
    }
    if (echo) {
      data.inspect()
      return this
    }
    return this._data(data)
  }

  highlight(code = null, language = 'javascript') {
    const {highlight} = require('cli-highlight')
    const opts = {language, ignoreIllegals: false}
    return this.highlighter((data) => {
      const tagged = highlight(data, opts)
      return tagged.replace(/<\/?[^>]+(>|$)/g, '') + '\n'
    })

    // return this._data(code || this.get('_data'))
  }

  // ----------------------------- timer ------------------

  startTimer(name) {
    fliptime.start(name)
    return this
  }
  stopTimer(name) {
    fliptime.stop(name)
    return this
  }
  lapTimer(name) {
    fliptime.lap(name)
    return this
  }
  fliptime(name) {
    return fliptime
  }
  echoTimer(name) {
    fliptime.log(name)
    return this
  }
  stopAndEchoTimer(name) {
    fliptime.stop(name).log(name)
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
    const _diffs = this.get('_diffs')
    const args = Array.from(arguments).map((arg) => clone(arg))

    this._diffs(_diffs.concat(args))
    return this
  }
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

  // https://remysharp.com/2014/05/23/where-is-that-console-log
  trackConsole() {
    const ops = ['log', 'warn']
    ops.forEach((method) => {
      var old = console[method]
      console[method] = function() {
        var stack = (new Error()).stack.split(/\n/)
          // Chrome includes a single "Error" line, FF doesn't.
        if (stack[0].indexOf('Error') === 0) {
          stack = stack.slice(1)
        }
        var args = [].slice.apply(arguments).concat([stack[1].trim()])
        return old.apply(console, args)
      }
    })
  }

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

  // https://www.npmjs.com/package/expose-hidden
  expose(shouldExpose = true) {
    this.set('expose', shouldExpose)
    return this
  }

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
    if (typeof data !== 'object') return this.data(data).verbose(5)
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

  formatter(cb) {
    if (!cb) cb = (arg) => {
      if (arg && typeof arg === 'object') {
        Object.keys(arg).forEach(key => {
          if (typeof arg[key] === 'string') {
            arg[key] = arg[key].replace('', '')
          }
          else if (Array.isArray(arg[key])) {
            arg[key] = arg[key].map(a => cb(a))
          }
        })
      }
      return arg
    }

    this.set('formatter', cb)
    return this
  }

  data(arg) {
    const cb = this.get('formatter')
    if (cb) arg = cb(arg)
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
    const filter = toarr(filters).concat(this.get('_filters') || [])
    return this._filters(filter)
  }
  tags(names) {
    const tags = this.get('_tags')
    const updated = tags.concat(toarr(names))
    return this._tags(updated)
  }

  // check if the filters allow the tags
  _filter() {
    const tags = this.get('_tags')
    const filters = this.get('_filters') || []
    const should = shouldFilter({filters, tags, instance: this})
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
  quick(arg) {
    this.reset()
    console.log('\n')
    this
      .color('yellow.bold')
      .text('=========== 💨  quick 💨  ===========')
      .space(1)
    if (arguments.length === 1) return this.data(arg).verbose().exit()
    return this.data(arguments).verbose().exit()
  }
  exit(log = true) {
    // this.trace()
    this.echo()
    this.reset()
    if (log) console.log('🛑  exit \n')
    process.exit()
  }
  catch() {
    this.error(arguments).exit(1)
  }

  reset() {
    if (!this.savedLog) this.savedLog = []

    // persist the time logging
    if (this.get('time')) {
      this.time(true)
    }
    this.time(false)

    this.boxStyles()
    this.barStyles()
    this._diffs([])
    this.color('magenta')
    this.text('')
    this.title(false)
    this.data(null)
    this._table(false)
    this.tosource(false)
    this.verbose(10)
    this.space(false)
    this.highlighter(false)
    this.silent(false)
    this._data(OFF)
    // this._filters([])
    this._tags([])
    return this
  }
  clear() {
    process.stdout.write(clc.reset)
    return this
  }

  // ----------------------------- sleeping ------------------

  sleep(time = 1000) {
    const sleepfor = require('sleepfor')
    sleepfor(time)
    return this
  }

  slow(time = 100) {
    this.set('sleepBetween', time)
    return this
  }

  sleepIfNeeded() {
    const sleepBetween = this.get('sleepBetween')
    if (sleepBetween) {
      const sleepfor = require('sleepfor')
      sleepfor(sleepBetween)
    }
    return this
  }

  // ----------------------------- actual output ------------------

  echo(data = OFF) {
    this.stack()
    this._filter()
    if (data === false) {
      this.reset()
      return this
    }
    if (data === OFF) data = this.get('_data')

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

    this.sleepIfNeeded()

    // so we can have them on 1 line
    const text = this.logText()
    const datas = this.logData()

    if (datas !== OFF && text !== OFF) {
      console.log(text, datas)
    }
    else if (datas !== OFF) {
      console.log(datas)
    }
    else if (text !== OFF) {
      console.log(text)
    }
    else {
      console.log(text, datas)
    }

    const spaces = this.logSpaces()
    if (spaces !== '') console.log(spaces)

    this.reset()
    return this
  }

  logText() {
    let text = this.get('_text')
    text = this.getColored(text)
    text = this.getTime(text)

    if (!text) return OFF

    text += this.logSpaces()

    return text
  }
  logData() {
    let data = this.get('_data')
    if (data === OFF) return OFF

    if (this.get('expose')) data = expose(data)
    data = this.getToSource(data)
    data = this.getVerbose(data)

    return data
  }
  logSpaces(msg = '') {
    const space = this.get('space')
    if (Number.isInteger(space)) return '\n'.repeat(space)
    if (space === true) return '\n\n\n'
    // else if (space !== undefined) console.log('\n')
    return msg || ''
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
    const highlighter = this.get('highlighter')

    // typeof msg === 'object' &&
    if (this.get('tosource')) {
      const tosource = require('tosource')
      if (highlighter) return highlighter(tosource(msg))
      return tosource(msg)
    }

    if (highlighter) return highlighter(msg)

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

  // https://github.com/sindresorhus/ora
  ora(options, dots = 'dots1') {
    // const cliSpinners = require('cli-spinners')
    const ora = require('ora')
    ora.fliplog = this
    this.Spinner = ora(options)
    return this.Spinner
  }

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
