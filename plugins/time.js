module.exports = {
  reset() {
    // persist the time logging
    if (this.get('time')) {
      this.time(true)
    }
    this.time(false)
  },
}
