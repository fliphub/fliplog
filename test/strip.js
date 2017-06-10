const log = (data, word) => {
  const fliplog = require('../')
  const stripAnsi = fliplog.requirePkg('strip-ansi')
  const {text, datas} = fliplog.text(word).prettyformat(data).returnVals()
  if (text) console.log(text)
  console.log(stripAnsi(datas))
}

log({user: true})
