const log = require('../')

var obj = {property: {}}
obj.circularReference = obj
obj[Symbol('foo')] = 'foo'
obj.map = new Map()
obj.map.set('prop', 'value')
obj.array = [1, NaN, Infinity]

// console.log(require('pretty-format')(obj))
// console.log(log)
// log.quick(log)
console.log('\n')
log.bold('========= prettyformat ========').echo()
log.prettyformat(obj).echo()

console.log('\n')
log.bold('========= fmtobj ========').echo()
const l = log.fmtobj(obj).echo()
// log.quick(l.entries())

// log.data(log.cleaner()).exit()
console.log('\n')
log.bold('========= cleaned obj ========').echo()

// CHAIN BACK UP TO LOG
const cleaner = log
  .cleaner(true)
  .keys([/array|circularReference|map|property/])
  .data(obj)
  .clean()
  .echo()

console.log('\n')
log.bold('========= inspector ========').echo()

log.verbose(10).data(obj).echo()
console.log('\n')

// console.log('\n\n')
log.bold('========= prettyjson ========').echo()

// CAN'T REALLY stringify this to json
const cheat = {
  property: {},
  map: {prop: 'value'},
  array: [1, NaN, Infinity],
  foo: 'foo',
}
// cheat.circularReference = cheat

console.log(log.prettyjson(cheat))
// log.json(JSON.stringify(cheat)).echo()
// log.json(log.jsStringify(obj)).echo()
console.log('\n')

log.bold('========= tosource ========').echo()
log.tosource().data(cheat).echo()
// log.formatter(cleaner.clean).data(obj).echo()
