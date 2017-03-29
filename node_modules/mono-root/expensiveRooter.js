function expensiveRootable(args = {depth: 1, asObj: false}) {
  const execa = require('execa')
  const paths = {
    farthest: false,
    nearest: false,
    fellback: false,
  }

  try {
    paths.nearest = removeNodeModulesAndBin(execa.sync('npm', ['bin']).stdout)
    paths.farthest = paths.nearest
    if (args.depth) {
      for (let i = 0; i < args.depth; i++)
        paths.farthest = npmUp(paths.farthest)
    }
  } catch (e) {
    console.log(e)
    paths.nearest = require('app-root-path').toString()
    paths.fellback = true
  }

  if (args.asObj) return paths
  return paths.farthest
}
