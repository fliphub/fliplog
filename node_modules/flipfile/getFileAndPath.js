module.exports = function getFileAndPath(file) {
  const split = file.split('/')
  const fileAndPath = {
    file: split.pop(),
    path: split.join('/'),
  }
  fileAndPath.dir = fileAndPath.path
  return fileAndPath
}
