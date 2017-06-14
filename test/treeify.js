var log = require('../')

console.log('\n\n\n\n')

log
  .color('green')
  .text('🌲  treeify')
  .tree({
    oranges: {
      mandarin: {
        clementine: null,
        tangerine: 'so cheap and juicy!',
      },
    },
    apples: {
      'gala': null,
      'pink lady': null,
    },
  })
  .echo()

console.log('\n\n\n')
