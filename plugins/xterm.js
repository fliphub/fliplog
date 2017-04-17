module.exports = {
  deps: {
    'cli-color': '1.2.0',
  },

  /**
   * @param  {number} color
   * @param  {number} [bgColor]
   * @return {FlipLog}
   */
  xterm(color, bgColor) {
    const clc = require('cli-color')

    if (typeof color === 'string' && color.includes('.')) {
      const colorArr = color.split('.')
      const txt = colorArr.shift()
      const bg = colorArr.pop()
      color = clc.xterm(txt).bgXterm(bg)
    }
    else if (color && bgColor) {
      color = clc.xterm(color).bgXterm(bgColor)
    }
    else if (Number.isInteger(color)) {
      color = clc.xterm(color)
    }
    else {
      color = clc.xterm(202).bgXterm(236)
    }

    return this.color(color)
  },
}
