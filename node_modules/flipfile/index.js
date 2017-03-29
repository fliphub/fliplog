const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const getFileAndPath = require('./getFileAndPath')
const getDirectories = require('./getDirectories')
const isDir = require('./isDir')
const isFile = require('./isFile')
const isRel = require('./isRel')
const walk = require('./walk')
const read = require('./read')
const write = require('./write')
const exists = require('./exists')
const fileName = require('./fileName')
const isFileOrDir = require('./isFileOrDir')
const del = require('./del')

module.exports = {
  getFileAndPath,
  getDirectories,
  isDir,
  isFile,
  isRel,
  walk,
  read,
  write,
  exists,
  fileName,
  isFileOrDir,
  isAbs: path.isAbsolute,
  mkdirp,
  path,
  fs,
  del,
}
