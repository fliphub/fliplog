function loader(requireContext) {
  // get the context keys
  // e.g. ['experiment', 'errors', 'express', 'helpscout', ...]
  //
  // get their module ids,
  // then require them with __webpack_require__
  const contextKeys = requireContext.keys()
  for (let i = 0, {length} = contextKeys; i < length; i++) {
    // use the file, to get the webpackId, to require the file with webpack
    const file = contextKeys[i]
    const webpackId = requireContext.resolve(file)
    const instance = __webpack_require__(webpackId)

    // do what thou wilt with the instance
  }

  return true
}

const requireContext = require.context('../example', true, /^\.\/[^\/]+?\/bundle\.js$/)
loader(requireContext)
