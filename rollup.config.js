const pkg = require('./package')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

export default {
  useStrict: false,
  entry: 'dist/index.js',

  plugins: [
    nodeResolve({
      jsnext: true,
      module: true,
      main: true,
      preferBuiltins: true,
    }),
    commonjs({
      include: '**/**',
    }),
  ],
  targets: [
    {
      dest: pkg.main,
      format: 'cjs',
    },
    {
      dest: pkg.module,
      format: 'es',
    },
  ],
}
