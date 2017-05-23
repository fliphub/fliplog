const {
  FuseBox,
  OptimisedBundlePlugin,
  BabelPlugin,
  JSONPlugin,
  UglifyJSPlugin,
} = require('fsbx')

let fuse = new FuseBox({
  homeDir: __dirname,
  sourcemaps: true,
  output: 'disted/$name.js',
  cache: false,
  log: true,
  debug: true,
  plugins: [
    JSONPlugin(),
    [BabelPlugin(), UglifyJSPlugin()],
    // OptimisedBundlePlugin(),
  ],
})

// fuse.dev()
fuse
  .bundle('fliplog')
  .target('server')
  .instructions(
    `[index.js] +[modules/**/*.js] +[deps/**/*.js] +[plugins/**/*.js] +[middleware/**/*.js]`
  )

fuse.run()
