// https://www.youtube.com/watch?v=SwSle66O5sU
const OFF = `${~315 >>> 3}@@`

module.exports = {
  // ----------------------------- getting data ------------------

  /**
   * @tutorial https://github.com/fliphub/fliplog#return
   * @return {ReturnVals}
   */
  returnVals() {
    const text = this.logText()
    const datas = this.logData()

    if (datas !== OFF && text !== OFF) return {text, datas}
    else if (datas !== OFF) return {datas}
    else if (text !== OFF) return {text}
    else return {text, datas}
  },

  /**
   * @tutorial https://github.com/fliphub/fliplog#return
   * @return {ReturnVal}
   */
  return() {
    if (this.has('tags') === true) {
      this._filter()
    }
    const returnVals = this.returnVals()
    const entries = this.entries()
    this.reset()
    return Object.assign(entries, returnVals)
  },
}
