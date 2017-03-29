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

    args: ['eh'],
    call(eh) {
      console.log(eh)
      return 'called!'
    },

    set(starfished) {
      canada.eh = starfished
      console.log('set!')
    },
  },
})

// console.log(canada)
// console._verbose(canada)

canada.starfish = 'starfished'

// console.log(canada.starfish)
console.log(canada.call.starfish('eh'))
console.log(canada)
console._verbose(canada)
