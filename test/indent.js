const log = require('../')

log
  .indent(10)
  .bold('PRETTYOBJ')
  .prettyobj({
    warnings: 0,
    apiStyle: 'Optimised numbers (Best performance)',
    target: 'server',
    uglify: true,
    removeExportsInterop: true,
    removeUseStrict: true,
    replaceProcessEnv: true,
    ensureES5: true,
    treeshake: true,
    nested: {
      deep: {
        deeper: {
          alltheway: [['array', 'of', 'arrays'], 'yup', ['mixed', 1, Infinity]],
        },
      },
    },
  })
  .echo()
