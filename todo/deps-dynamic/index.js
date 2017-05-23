const plugins = configs.exportee
const shh = {
  shushed: false,
}
let shushed = {}
let required = []

const log = new LogChain().new()

const dd = new DynamicDeps(pkgDebug)
for (let u = 0; u < plugins.length; u++) {
  if (pkgDebug === true) {
    console.log('using plugin', plugins[u])
  }

  dd.use(plugins[u])
  log.use(plugins[u])
}

dd.installIfNeeded().clean()

if (pkgDebug === true) {
  console.log('fliplog setup')
}

log.reset()
log.pkg = configs.pkg
