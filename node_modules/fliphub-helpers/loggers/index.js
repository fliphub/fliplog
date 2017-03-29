// @TODO:
// var ref = null
// if (msg.helpers) {
//   ref = msg.helpers
//   delete msg.helpers
// }
//
// https://developer.mozilla.org/en-US/docs/Web/API/Console/table
// https://github.com/Automattic/cli-table
require('./inspector')
require('./timer')
const chalk = require('chalk')
const clc = require('cli-color')
global.inspector = require('./inspect')

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

const xterm = {
  colors: {
    'orange': 202,
  },
  bg: {
    'orange': 236,
  },
}

const combinations = clrs.concat(bgColors).concat(em)


// global.sleep = (time) => {
//   if (!time) time = 200
//   var i = 0
//   while (i < time) {
//     i++
//     console.log('eh?')
//     // sleep()
//   }
// }

// https://github.com/npm/npmlog
// @TODO: more args, but this kind of forces a nice terseness
function log(message, options) {
  const tosource = require('tosource')
  if (typeof options === 'string') options = {level: options}
  var defaults = {
    level: 'debug',
    space: false,
    color: 'purple',
    verbose: false,
    source: false,
    text: false,
    time: true,
    data: false,
  }
  options = Object.assign(defaults, options)
  if (options.name) options.level = options.name
  if (options.data) {
    if (options.level !== 'debug') options.level = message
    message = options.data
  }

  if (Number.isInteger(options.space)) console.log('\n'.repeat(options.space))
  if (options.space === true) console.log('\n\n\n')
  try {
    if (typeof options.color === 'function' || options.color === false) {}
    else if (!options.color || (!chalk[options.color] && !options.color.includes('.')))
      options.color = 'magenta'

    // var {level, color} = options
    var level = options.level
    var color = options.color
    var text = options.text
    if (color === 'purple') color = 'magenta'

    if (typeof message != 'string' && options.verbose) {
      // const omitDeep = require('omit-deep-lodash')
      // const _ = require('lodash')
      // _.omit(message, 'helpers', 'fs', 'ws')
      // message = util.inspect(message, {
      //   showHidden: true,
      //   depth: null,
      //   showProxy: true,
      //   maxArrayLength: null,
      //   colors: true,
      //   // colors: {}
      // })
      // console.log(message)
      // message = omitDeep(message, ['helpers', 'flags', 'ws'])
      const util = require('util')
      const PrettyError = require('pretty-error')
      let err = false
      if (message && message.stack) {
        const pe = new PrettyError()
        err = console.log(pe.render(message))
        delete message.stack
        message.message = message.message.split('\n')
        // delete message.message
      }

      message = inspector(message)

      // const emptyFnReg = /(\[Function\] \[length]: [0-9]+, \[name]: '')/gmi
      // (?:.*)

      // usually works but was causing an infinite loop...
      // const emptyFnReg = /(\{(?:.*)\[Function\](?:.*)\[length]:(?:.*),(?:.*)\[name]:(?:.*)''(?:.*))/gm
      // const matches = message.match(emptyFnReg)
      // if (matches) {
      //  -> // message = message.replace(emptyFnReg, chalk.italic('[NoNameFn]'))
      //
      //
      //   // message = message.replace(/: undefined,/, chalk.black('undefined'))
      //   // console.log(matches)
      //   // process.exit(1)
      //   // message = JSON.stringify(message)
      //   // console.log(message)
      //   // process.exit(1)
      // }
    }
    if (typeof message === 'object' && options.source) message = tosource(message)

    var logger = chalk

    // maybe we colored with something not in chalk
    // like xterm
    if (typeof color === 'function') logger = color
    else if (color === false) logger = msg => msg
    else if (color.includes('.'))
      color.split('.').forEach(clr => logger = logger[clr])
    else if (combinations.includes(color))
      logger = logger[color]

    let lvl
    if (text)
      lvl = `${logger(message)}`
    else
      lvl = `${logger(level)}:`

    if (options.time) {
      let data = new Date()
      let hour = data.getHours()
      let min = data.getMinutes()
      let sec = data.getSeconds()
      let ms = data.getMilliseconds()
      hour = hour < 10 ? `0${hour}` : hour
      min = min < 10 ? `0${min}` : min
      sec = sec < 10 ? `0${sec}` : sec
      ms = ms < 10 ? `0${sec}` : ms
      // message = chalk.yellow(`${hour}:${min}:${sec}:${ms} `) + message
      // lvl = chalk.yellow(`:${ms}: `) + lvl
      lvl = chalk.yellow(`${min}:${sec}:${ms}: `) + lvl
    }

    if (text)
      console.log(lvl)
    else
      console.log(lvl, message)

    if (Number.isInteger(options.space)) console.log('\n'.repeat(options.space))
    if (options.space === true) console.log('\n\n\n')

    clc.reset
  } catch (e) {
    console.log(e)
    console.log(`${color}${(level)}:`, message)
    clc.reset
  }
}

function underline(str) {
  return '\x1B[4m' + str + '\x1B[24m'
}
function bold(str) {
  return '\x1B[1m' + str + '\x1B[22m'
}

log.underline = underline
log.bold = bold
log.verbose = function(msg, options) {
  var defaults = {
    verbose: true,
    level: 'verbose',
  }
  options = Object.assign(defaults, options)
  log(msg, options)
}
log.text = function(msg, options) {
  var defaults = {
    text: true,
  }
  options = Object.assign(defaults, options)
  log(msg, options)
}
log.text.color = function(msg, color, options) {
  var defaults = {
    text: true,
    color,
  }
  options = Object.assign(defaults, options)
  log(msg, options)
}

clrs.forEach(clr => {
  log.text.color[clr] = function(msg, options) {
    var defaults = {
      text: true,
      color: clr,
    }
    options = Object.assign(defaults, options)
    log(msg, options)
  }
})

log.text.color.xterm = function(msg, color, options) {
  // console.log(color)
  // if (!color)

  if (typeof color === 'string' && color.includes('.')) {
    const colorArr = color.split('.')
    const txt = colorArr.shift()
    const bg = colorArr.pop()
    // color = clc[txt][bg]
    color = clc.xterm(txt).bgXterm(bg)
  }
  else if (Number.isInteger(color))
    color = clc.xterm(color)
  else
    color = clc.xterm(202).bgXterm(236)
  options = Object.assign({
    text: true,
    // time: false,
    color: false,
  }, options)

  // console.log(color('eh'))
  log(color(msg), options)
}


log.error = function(msg, options) {
  var defaults = {
    level: 'error',
    verbose: true,
    color: 'bgRed.black',
  }
  options = Object.assign(defaults, options)
  log(msg, options)
}
log.warn = function(msg, options) {
  var defaults = {
    level: '⚠ warning',
    color: 'bgYellow.black',
  }
  options = Object.assign(defaults, options)
  log(msg, options)
}

log.debug = function(msg, options) {
  var defaults = {
    level: 'DEBUG::::::::::',
    color: 'bgBlue.white',
    space: 20,
  }
  options = Object.assign(defaults, options)
  log(msg, options)
}

log.exit = function() {
  // let all = arguments // Object.values(arguments)
  // log.verbose(all)
  for (let arg of arguments) log.verbose(arg)


  console.warn('log.exit')
  setTimeout(() => process.exit(1), 1)
  throw new Error('log.exit.trace')
}
console._log = log
console._color = log.text.color
console._text = log.text
console._error = log.error
console._warn = log.warn
console._verbose = log.verbose
console._exit = log.exit
console._debug = log.debug

// Object.defineProperty(console, 'exit', {value: console.exit})
// Object.defineProperty(console, 'debug', {value: console.debug})
// Object.defineProperty(console, 'debug', {value: console.debug})
// Object.defineProperty(console, 'debug', {value: console.debug})
console.exit = console._exit
console.color = console._color
console.error = console._error
console.verbose = console._verbose
console.text = console._text
console.debug = console._debug
console.xterm = log.text.color.xterm


// if (!console.debug) console.debug = console.debug

module.exports = log
