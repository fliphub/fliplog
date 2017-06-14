const argv = process.argv.slice(0)
process.argv.push('--DEBUG_DEPTH=1')
process.argv.push('--DEBUG_SHOW_HIDDEN=false')
process.argv.push('--DEBUG_COLORS=false')

process.argv.push(`--debug 'eh, !canada'`)

const log = require('../')

// log.quick(log)
const obj = {
  debug: {
    eh: true,
    super: {
      deep: {
        nope: 0,
      },
    },
  },
}

// disabled by flags
log.prettyobj(obj).tag('canada').echo()
log.data(obj).bold('ehn').tag('eh').echo()

process.argv = argv

// this should echo deep because argv is restored,
// ...but even if it was not restored,
// this will still go deep, but normal data inspecting does not
// @TODO: lots of formatting/formatters that have to respect the flags...
log.prettyobj(obj).bold('ehn').tag('eh').echo()
