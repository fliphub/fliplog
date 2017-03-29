const deepReplaceProp = require('./prop')
const deepReplaceMatch = require('./match')

const exportee = {
  match: deepReplaceMatch,
  deepReplaceMatch,

  prop: deepReplaceProp,
  deepReplaceProp,
}
module.exports = exportee
