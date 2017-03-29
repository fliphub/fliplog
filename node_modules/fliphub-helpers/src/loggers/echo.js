const ansi = require('ansi')
const cursor = ansi(process.stdout)

module.exports = function echo(str) {
  let data = new Date()
  let hour: any = data.getHours()
  let min: any = data.getMinutes()
  let sec: any = data.getSeconds()

  hour = hour < 10 ? `0${hour}` : hour
  min = min < 10 ? `0${min}` : min
  sec = sec < 10 ? `0${sec}` : sec

  cursor.yellow().write(`${hour}:${min}:${sec} : `)
          .green().write(str)
  cursor.write('\n')
  cursor.reset()
}
