const FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m
const FN_ARG_SPLIT = /,/
const FN_ARG = /^\s*(_?)(\S+?)\1\s*$/
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg

module.exports = function formalParameterList(fn) {
  var args = []
  var fnText = fn.toString().replace(STRIP_COMMENTS, '')
  var argDecl = fnText.match(FN_ARGS)
  var r = argDecl[1].split(FN_ARG_SPLIT)

  for (var i = 0; i < r.length; i++) {
    var arg = r[i]
    arg.replace(FN_ARG, function(all, underscore, name) {
      args.push(name)
    })
  }

  return args
}
