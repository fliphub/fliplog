const computed = require('./index')
const canada = computed({
  normalData1: 1,
  normalData2: 2,
  otherData3: 3,
  some: {
    nested: {
      data: {
        eh: '?',
      },
    },
  },
  magical: {
    forrest: 'super magical and radical',
  },
  magicalForrest: {
    with: ['magical.forrest'],
    get(magicForrest) {
      console.log('magical forrest')
    },
  },

  dataAdded: {
    with: ['normalData1', 'normalData2', 'normalData3'],
    get(one, two, three) {
      return one + two + three
    },
  },
  short: {
    with: ['some.nested.data.eh'],
    get(eh) {
      return eh
    },
  },
  superMagicalForrest: {
    with: ['magicalForrest', 'starfish', 'short', 'dataAdded'],
    get(magicalForrest, starfish, short, dataAdded) {
      return {magicalForrest, starfish, short, dataAdded}
    },
  },

  starfish: {
    get() {
      return 'whatever'
    },
  },
})

console.log(canada)
console.log(canada.magicalForrest)
console.log(canada.short)
console.log(canada.dataAdded)
console.log(canada.starfish)
console.log(canada.superMagicalForrest)
