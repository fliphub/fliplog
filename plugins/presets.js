// presets
function presetError(chain) {
  return chain.text('🚨  error:').color('bgRed.black').verbose(10)
}
function presetWarning(chain) {
  return chain.text('⚠  warning:').color('bgYellow.black').verbose(10)
}
function presetInfo(chain) {
  return chain.text('ℹ️️  info:').color('blue')
}
function presetNote(chain) {
  return chain.text('📋️  note:').color('dim')
}
function presetImportant(chain) {
  return chain.text('❗  important:').color('red.bold')
}

module.exports = {
  reset() {
    this.addPreset('error', presetError)
    this.addPreset('warning', presetWarning)
    this.addPreset('info', presetInfo)
    this.addPreset('note', presetNote)
    this.addPreset('important', presetImportant)
  },

  /**
   * @param {string} name
   * @param {Object} preset
   * @return {FlipLog}
   */
  addPreset(name, preset) {
    this.presets[name] = preset
    if (this[name] === undefined) {
      this[name] = () => this.preset(name)
    }
    return this
  },

  /**
   * @tutorial https://github.com/fliphub/fliplog#-presets
   * @param {Array<Object> | Object} names
   * @return {FlipLog}
   */
  preset(names) {
    if (!Array.isArray(names)) names = [names]

    Object.keys(names).forEach(index => {
      const name = names[index]
      this.presets[name](this)
    })

    return this
  },
}
