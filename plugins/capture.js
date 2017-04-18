module.exports = (shh) => {
  return {
    // ----------------------------- storing / capturing data ------------------
    // https://gist.github.com/pguillory/729616#gistcomment-332391
    saveLog(data, fileDescriptor) {
      this.fileDescriptor = fileDescriptor
      this.savedLog.push(data)
      return this
    },
    shush() {
      shh.shushed = true
      return this
    },
    unshush() {
      shh.shushed = false
      return this
    },
    startCapturing(output = false) {
      const saveLog = this.saveLog.bind(this)
      this.stdoutWriteRef = process.stdout.write
      process.stdout.write = (function(write) {
        return function(string, encoding, fileDescriptor) {
          saveLog(string, fileDescriptor)
        // write.apply(process.stdout, arguments)
        }
      })(process.stdout.write)
      return this
    },
    stopCapturing() {
      process.stdout.write = this.stdoutWriteRef
      return this
    },
  }
}
