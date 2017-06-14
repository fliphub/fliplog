const fliplog = require('../')

const _log = (data, word) => {
  const stripAnsi = fliplog.requirePkg('strip-ansi')
  const {text, datas} = fliplog.text(word).prettyformat(data).returnVals()
  if (text) console.log(text)
  console.log(stripAnsi(datas))
}

// _log({user: true})


fliplog.strip().bold('uncolor me').echo()
fliplog.strip(fliplog.chalk().yellow('uncolor-me-too')).echo()
