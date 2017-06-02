const log = require('../')

log.color('bold').ora('spinner 1 msg').start()

setTimeout(() => log.Spinner.succeed(), 2000)
// setTimeout(() => log.stopSpinner(), 2000)
