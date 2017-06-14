const log = require('../')

const eh = {
  eh: true,
}
const two = {
  added: true,
  eh: false,
}
log.diff(eh, two).echo()
log.diff('eh', 'ehoh').echo()

const oneOne = {oneOne: 'was a race horse 🐎'}
log.diff(oneOne)
const twoTwo = Object.assign({twoTwo: 'was one too.'})
log.diff(twoTwo)
log.echo()

let oneOneTwoTwo = 'one-one  was a race horse 🐎 '
log.diff(oneOneTwoTwo)
log.diff(oneOneTwoTwo + '... two-two was one, two.')
log.echo()

log
  .bold('💸\n')
  .tree({
    going: {
      down: {
        down: {
          down: '🔥',
        },
      },
    },
  })
  .echo()
