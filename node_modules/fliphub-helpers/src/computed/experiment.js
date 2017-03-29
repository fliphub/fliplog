decorated[key].prototype = eval(`{
  get ${key}: {
    return referenceToValueGet.apply(this, withs)
  }
}`)

decorated[key].prototype.__defineGetter__(key, function() {
  console.log('getter?')
  return referenceToValueGet.apply(this, withs)
})

console.log(canada.starfish.fn('eh'))

decorated.watch(key, function(changed) {
  console.log(changed)
})

// works, but makes it not exit
require('./observe')()
Object.defineProperty(decorated, key, definitions)
Object.observe(decorated, function() {
  console.log('observed?!', arguments)
})
setTimeout(() => {
  console.log('unobserve')
  Object.unobserve(decorated, function() {
    console.log('bye bye')
    process.exit()
  })
  Object.unobserveAll(function() {
    console.log('bye bye')
    process.exit()
  })
  decorated.fuck = 'fuck'
}, 200)
