let charm = require('charm')()
charm.pipe(process.stdout)
charm.reset()

let colors = ['red', 'cyan', 'yellow', 'green', 'blue']
let text = 'Always after me lucky charms.'

let offset = 0
let iv = setInterval(() => {
  let y = 0, dy = 1
  for (let i = 0; i < 40; i++) {
    let color = colors[(i + offset) % colors.length]
    let c = text[(i + offset) % text.length]
    charm
      .move(1, dy)
      .foreground(color)
      .write(c)

    y += dy
    if (y <= 0 || y >= 5) dy *= -1
  }
  charm.position(0, 1)
  offset++
}, 150)
