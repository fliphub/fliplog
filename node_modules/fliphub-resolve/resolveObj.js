const isRel = require('flipfile/isRel')
const {match} = require('deep-replace')

module.exports = function resolveDeep(resolve, object, blacklist = ['not-this-file']) {
  const test = (file) => isRel(file) && !blacklist.includes(file)
  const decorator = ({val, obj, prop}) => {
    obj[prop] = resolve(val)
  }

  // obj, valueTest, propertyTest, decoratorFn
  match(object, test, null, decorator)

  return object
}
