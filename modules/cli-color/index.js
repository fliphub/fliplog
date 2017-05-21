var d = require('d')
var assign = require('es5-ext/object/assign')
var forEach = require('es5-ext/object/for-each')
var map = require('es5-ext/object/map')
var primitiveSet = require('es5-ext/object/primitive-set')
var setPrototypeOf = require('es5-ext/object/set-prototype-of')
var memoize = require('memoizee')
var memoizeMethods = require('memoizee/methods')
var sgr = require('./lib/sgr')

var mods = sgr.mods
var join = Array.prototype.join
var defineProperty = Object.defineProperty
var max = Math.max
var min = Math.min
var variantModes = primitiveSet('_fg', '_bg')
var xtermMatch
var getFn

// Some use cli-color as: console.log(clc.red('Error!'));
// Which is inefficient as on each call it configures new clc object
// with memoization we reuse once created object
var memoized = memoize((scope, mod) => {
  return defineProperty(
    getFn(),
    '_cliColorData',
    d(assign({}, scope._cliColorData, mod))
  )
})

var proto = Object.create(
  Function.prototype,
  assign(
    map(mods, mod => {
      return d.gs(function() {
        return memoized(this, mod)
      })
    }),
    memoizeMethods({
      // xterm (255) color
      xterm: d(function(code) {
        code = isNaN(code) ? 255 : min(max(code, 0), 255)
        return defineProperty(
          getFn(),
          '_cliColorData',
          d(
            assign({}, this._cliColorData, {
              _fg: [xtermMatch ? xtermMatch[code] : '38;5;' + code, 39],
            })
          )
        )
      }),
      bgXterm: d(function(code) {
        code = isNaN(code) ? 255 : min(max(code, 0), 255)
        return defineProperty(
          getFn(),
          '_cliColorData',
          d(
            assign({}, this._cliColorData, {
              _bg: [xtermMatch ? xtermMatch[code] + 10 : '48;5;' + code, 49],
            })
          )
        )
      }),
    })
  )
)

var getEndRe = memoize(
  code => {
    return new RegExp('\x1b\\[' + code + 'm', 'g')
  },
  {primitive: true}
)

if (process.platform === 'win32') xtermMatch = require('./lib/xterm-match')

getFn = function() {
  return setPrototypeOf(
    function self(/*…msg*/) {
      var start = '',
        end = '',
        msg = join.call(arguments, ' '),
        conf = self._cliColorData,
        hasAnsi = sgr.hasCSI(msg)
      forEach(
        conf,
        (mod, key) => {
          end = sgr(mod[1]) + end
          start += sgr(mod[0])
          if (hasAnsi) {
            msg = msg.replace(
              getEndRe(mod[1]),
              variantModes[key] ? sgr(mod[0]) : ''
            )
          }
        },
        null,
        true
      )
      return start + msg + end
    },
    proto
  )
}

module.exports = Object.defineProperties(getFn(), {
  xtermSupported: d(!xtermMatch),
  _cliColorData: d('', {}),
})
