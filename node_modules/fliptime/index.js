class Timer {
  constructor() {
    this.times = {}
    this.laps = {}
  }
  start(name) {
    if (this.times[name] && this.times[name].start) return this.lap(name)
    this.times[name] = {}
    this.times[name].start = Date.now()
    return this
  }

  lap(name) {
    if (!this.times[name]) return this.start(name)
    if (!this.laps[name]) {
      this.laps[name] = []
      const end = Date.now()
      const start = this.times[name] ? this.times[name].start : Infinity
      const diff = end - start
      this.laps[name].push({end, diff})
    } else {
      const prevEnd = this.laps[name].slice(0).pop().end
      const end = Date.now()
      const diff = end - prevEnd
      this.laps[name].push({diff, end})
    }
    return this
  }

  logLaps(name) {
    const msg = this
      .laps[name]
      .map(lap => lap.diff)
      .reduce(((a, b) => a + b), 0)
      + this.times[name].diff || 0

    // console.log(this.times[name], this.laps[name])
    const level = '⏲  laps ' + name + ' took: '
    console.log(level + msg)
    return this
  }

  stop(name) {
    if (this.times[name].end) return this.lap(name)

    this.times[name].end = Date.now()
    this.times[name].diff = this.times[name].end - this.times[name].start
    return this
  }
  log(name) {
    const msg = this.times[name].diff + 'ms'
    const level = '⏲  ' + name + ' took: '
    console.log(level + msg)
    return this
  }
}

module.exports = new Timer()
