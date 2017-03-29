const computed = require('./index')

const canada = computed({
  magical: {
    forrest: 'super magical and radical',
  },
  starfish: {
    with: ['magical.forrest'],
    get(magicForrest) {
      console.log('magical forrest')
      return magicForrest
    },
  },
})

const eh = canada.computed({
  moose: {
    forrest: 'super magical and radical',
  },
  extending: {
    with: ['magical.forrest', 'starfish'],
    get(magicForrest, starfish) {
      console.log('magical forrest')
      return magicForrest
    },
  },
})

console.log(canada)
console.log(canada.starfish)
