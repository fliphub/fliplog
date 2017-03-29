// https://github.com/codekirei/first-open-port
module.exports = function firstOpenPort(port, max) {
  var net = require('net')
  max = max || 65535
  var err = `no ports open from ${port} to ${max}`

  return new Promise((resolve, reject) =>
    (function test() {
      var server = net.createServer()
      server.on('error', () => {
        if ((port += 1) <= max) test()
        else reject(new Error(err))
      })
      server.on('listening', server.close)
      server.on('close', () => resolve(port))
      server.listen(port)
    })()
  )
}
