module.exports = {

  /**
   * @see chalk
   * @param  {string} color
   * @return {FlipLog}
   */
  color(color) {
    return this.set('color', color)
  },

  /**
   * @since 2.0
   * @param {string} color
   * @return {string} highlighted
   */
  // getChalked(msg) {}
  // colored() {
  //   return chalk[]
  // }
  chalk() {
    return require('chalk')
  },
}
