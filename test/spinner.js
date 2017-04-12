const log = require('../')

// instance available on log.Spinner
log.color('bold').spinner('spinner 1 msg')

setTimeout(() => log.stopSpinner(), 5000)
