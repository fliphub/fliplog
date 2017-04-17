module.exports = {
  deps: {
    'beeper': '1.1.1',
  },
  beep(sequence = 3, echo = false) {
    const beep = require('beeper')
    const data = {
      inspect() {
        beep(sequence)
        return 'beeping! '
      },
    }
    if (echo) {
      data.inspect()
      return this
    }
    return this.set('data', data)
  },
}
