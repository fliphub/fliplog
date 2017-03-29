module.exports = function initClassOrObj(Obj, args, method) {
  if (!method) method = 'init'

  if (toString.call(Obj) === '[object Function]') return new Obj(args)
  if (Obj[method]) return Obj[method](args)
  return Obj
}
