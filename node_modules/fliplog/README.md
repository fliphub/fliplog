# ⛓🔈 fliplog
> fluent logging with verbose insight, colors, tables, emoji, filtering, spinners, progress bars, timestamps, capturing, stack traces, clearing, & presets

[![NPM version][npm-image]][npm-url]
[![MIT License][license-image]][license-url]
[![fliphub][gitter-badge]][gitter-url]

![Screenshot](https://cloud.githubusercontent.com/assets/4022631/24160506/46c47d34-0e1f-11e7-8c27-4b653330ae02.png)


## usage
```bash
yarn add fliplog
npm i fliplog --save
```

```js
const log = require('fliplog')
```


## 📋 legend:
- [basics](#-basics)
- [stringifying](#stringifying)
  - [json](#json)
  - [stringify](#-stringify)
- [silencing](#-silencing)
  - [capture all](#capture-all)
  - [return formatted values](#return)
  - [return values](#return)
- [color](#-color)
  - [chalk](#chalk)
  - [shorthands](#shorthands)
  - [xterm](#xterm)
- [function](#function)
- [emoji](#emoji)
- [filtering](#-filtering)
  - [.filter](#filter-and-tags)
  - [.tags](#filter-and-tags)
- [.quick](#-quick)
- [.table](#-tables)
  - [.diff](#-diff)
  - [.row](#row)
- [.diff](#diff)
- [spinner](#-spinner)
- [stack traces](#-stack-traces)
- [finding logs](#-find-logs)
- [catch errors](#-catch-errors)
- [trace](#trace)
- [clear](#-clear)
- [deep](#-deep)
  - [verbose vs tosource](#vs)
  - [verbose](#verbose)
  - [tosource](#tosource)
- [presets](#-presets)
  - [add your own](#add-your-own)
  - [use built ins](#use-built-ins)
- [timestamps](#-timestamps)
- [from](#from)



## 👋 basics
```js
log
  .data({anyKindOfData: true}) // .json, .stringify, .tosource, .verbose
  .text('text to use, this is what gets colored')
  .color('bold') // any cli-color, chalk, available as shorthands
  .echo() // outputs the log, .return to return the formatted values
```


## 🎀 stringifying
### json

[prettyjson](https://www.npmjs.com/package/prettyjson)

```js
// optional second arg for options passed into pretty json
log.json({eh: 'prettified'})
```

### stringify

[javascript-stringify](https://www.npmjs.com/package/javascript-stringify)

```js
// args are the same as javascript-stringify
log.stringify({data: 'can stringify deep things'})
```


## 🙊 silencing
- to disable outputting a log, `.silence()` (optional `true`/`false` arg)
- to disable **all** logs, `.shush()`
- to enable **all** logs, `.unshush()`

### capture all

> capture output of all console logs everywhere

```js
log.startCapturing()

console.log('this will be captured')
log.stopCapturing()

// captured data is available here
const saved = log.savedLog
```

### return

return only echos from fliplogs, useful for getting formatted data.

```js
// formatted data
const {text, data} = log
  .data({catchMeIfYouCan: true})
  .text('gingerbread man')
  .returnVals()

// this returns everything inside, it will call .filter first
const everything = log
  .color('blue.underline')
  .data({canYouHandleIt: true})
  .text('M')
  .return()
```




## 🎨 color

### chalk

![chalks](https://github.com/chalk/ansi-styles/raw/master/screenshot.png)

all [chalk](https://github.com/chalk/chalk) colors available with `.color`

```js
log
.text('\n========================================\n')
.color('bold')
.echo()
```

#### shorthands
```js
log
  .bold('same as calling .color(bold).text(all this text)')
  .echo()
```

### xterm
![cli-colors](https://cloud.githubusercontent.com/assets/4022631/24440335/7edf540c-1408-11e7-8d3b-b460d794f3b0.png)

all [cli-color](https://www.npmjs.com/package/cli-color) are available by calling `.xterm`

```js
log
  .time(true)
  .xterm(202, 236).text(' orange!!! ')
  .echo()
```


## function
because it's javascript, the log is an object... but it can be called as a function for convenience

```js
log({data: true}, 'text', 'color')
```

stack

## emoji
names using [emoji-commits](https://github.com/aretecode/emoji-commits) are available with `.emoji` (currently 🚧 not all have been ported yet)

```js
log
  .emoji('phone')
  .text('et')
  .data('phone home')
  .echo()
```

## ☕ filtering
can use comma separated strings, or arrays

### filter & tags
```js
log
  .filter('!nope, yes')

log
  .tag('unrelated,nope')
  .cyan('you will never see me :-(')
  .echo()

log
  .tag('yes')
  .underline('yay!')
  .echo()
```

## ⏲ quick

quickly log data and exit if you want to stop execution at a certain point for
debugging

```js
log.quick({give: 'me'}, 'everything', 'and quit')

// or
log.data({now: 'die'}).exit(1)
```


## ⬛ tables
![Screenshot](http://i.imgur.com/sYq4T.png)
extending [cli-table2](https://github.com/jamestalmage/cli-table2)

```js
log
  .table(['header1', 'header2'], ['row1', 'row2'])
  .echo()

log
  .table(['header1', 'header2'])
  .row({'key1': 'val1'})
  .row({'key2': 'val2'})
  .echo()
```

### ⚖️ diff
using [deep-diff](https://www.npmjs.com/package/deep-diff), you can compare before and after data differences as tables. Data will be cloned so it can be mutated and then compared.

```js
const royalty = {
  posh: true,
}
const lowlyPeasant = {
  pauper: true,
}

log.diff(royalty)
const abomination = deepmerge(royalty, lowlyPeasant)
log
  .diff(abomination)
  .doDiff()
  .echo()
```


## 🌀 spinner
extends [cli-spinner](https://www.npmjs.com/package/cli-spinner#demo)

```js
// instance available on log.Spinner
log.startSpinner('spinner message', {
  // optional spinner args
  onTick: () => {},

  // where to output the logs, default process.stdout
  stream: () => {}

  // default 60
  delay: 80,
})

console.log('log this, then spinner shows up again - it is sticky.')

log.stopSpinner()
```


## 🗺 stack traces

### ⚾ catch errors

will output the stack trace formatted and inspected deeply with the error preset

```js
const ForeverAndEver = new Promise(resolve => Promise.resolve())
  .then(() => Promise.reject('💍'))
  .catch(log.catch)
```

### 🔎 find logs
in your entry point, calling `log.track()` will output the location all of the next logs output from.

```js
log.track()

// later on...

log.bold('I cannot be found... oh wait, I was tracked.').echo()
```

### trace
calling `.trace` will output a shortened stack trace to the current location.
```js
log.data({bigData: 'oh'}).trace().echo()
```



## ✘ clear
> this will clear the terminal (at least, move it down so it is clear)
```js
log.clear()
```


## 🕳 deep

### vs
| goal                          | winner       
| -------------                 |:-------------:|
| code source                   | tosource      |
| deep inside objects           | verbose       |
| colors                        | verbose       |

### verbose
using [inspector-gadget](https://www.npmjs.com/package/inspector-gadget), objects are inspected and colorized as deep as configured

```js
log
  .bold('verbose:')
  .data({
    numbers: 1000,
    booleans: true,
    functions: () => {},
    strings: 'wacky wavy fun',
  })
  .verbose(/* optional number for how deep to go */)
  .echo()
```

### tosource
> see the code source
using [tosource](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toSource) [for nodejs](https://www.npmjs.com/package/tosource) you can look at the source of a variable

```js
log
  .bold('tosource:')
  .data({
    numbers: 1000,
    booleans: true,
    functions: () => {},
    strings: 'wacky wavy fun',
  })
  .tosource()
  .echo()
```

## 🍰 presets

### add your own
```js
log.addPreset('warning', (chain) => {
  return chain.text('⚠  warning:').color('bgYellow.black').verbose(10)
})
```

### use built-ins
```js
log
  .preset('warning')
  .data('nananenano!')
  .echo()

log
  .preset('error')
  .data(new Error('prettyfull!'))
  .echo()
```


### ⌛ timestamps
```js
log
  .time(true)
  .color('cyan')
  .text('🕳  so deep, so colorful, so meta  🎨  ')
  .data(log)
  .verbose()
  .echo()
```


## from

to use logging from a pure js object, `.from` is available

```js
log.from({
  data: 'data',
  text: 'eh',
  color: 'bold',
  echo: true,
})
```

^ is the same as

```js
log
  .text('eh')
  .data('data')
  .color('bold')
  .echo()
```

## 🚧
- progress bar,
- to file,
- to stream
- middleware alongside .return

[npm-image]: https://img.shields.io/npm/v/fliplog.svg
[npm-url]: https://npmjs.org/package/fliplog
[standard-image]: https://img.shields.io/badge/code%20style-standard%2Bes6+-brightgreen.svg
[standard-url]: https://github.com/aretecode/eslint-config-aretecode
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: https://spdx.org/licenses/MIT
[gitter-badge]: https://img.shields.io/gitter/room/fliphub/pink.svg
[gitter-url]: https://gitter.im/fliphub/Lobby
