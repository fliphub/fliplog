const {resolve} = require('path')
const {existsSync, writeFileSync, readFileSync} = require('fs')

let pkgDebug = false

function tryJSON(json) {
  try {
    const parsed = JSON.parse(json)
    return parsed
  } catch (e) {
    return false
  }
}

// @NOTE this cache file that is used will not persist across installs
//
// https://github.com/yeoman/configstore/blob/master/index.js
module.exports = class DynamicDeps {
  constructor(debug) {
    pkgDebug = debug
    this.deps = []
    this.resolvedDeps = []
    this.hydrate()
  }

  /**
   * @param {Object} obj
   * @return {DynamicDeps}
   *
   * @see DynamicDeps.deps
   * @example input
   * {
   *   'flipfile': '4.5.0',
   *   'fliphub': '0.1.8',
   * },
   *
   * @example output
   * `npm i flipfile@4.5.0 fliphub@0.1.8`
   */
  use(obj) {
    if (obj.deps !== undefined) {
      const deps = Object.keys(obj.deps)

      for (let d = 0; d < deps.length; d++) {
        const pkg = deps[d]

        // ignore if we cached it recently
        if (this.canUseCache === true && this.cache.deps.includes(pkg)) {
          continue
        }

        try {
          if (pkgDebug === true) console.log('trying ', pkg)
          require.resolve(pkg)
          this.resolvedDeps.push(pkg)
          continue
        }
        catch (e) {
          if (pkgDebug === true) {
            console.log('could not resolve ', pkg)
            console.log(e)
            console.log('\n')
          }
          const version = obj.deps[pkg]
          const dep = pkg + '@' + version
          this.deps.push(dep)
        }
      }

      delete obj.deps
    }

    return this
  }

  /**
   * @return {DynamicDeps}
   */
  clean() {
    this.deps = []
    this.resolvedDeps = []
    return this
  }

  /**
   * @return {DynamicDeps}
   */
  hydrate() {
    if (this.cache !== undefined) {
      return this.cache
    }
    const cacheFile = resolve(__dirname, './cache.json')

    if (existsSync(cacheFile) === false) {
      this.canBeUsed = false
      return this
    }

    let cache = readFileSync(cacheFile, 'utf8')

    // because the cache was cleared
    // this is default
    // so we write contents, and don't use it a single time
    if (cache.trim() === '{}') {
      if (pkgDebug === true) {
        console.log('cache was busted, saving for next time')
      }
      this.wasBusted = true
      return this
    }

    this.cache = tryJSON(cache)

    // diff in hours
    const diff = Date.now() - cache.time

    if (diff < 1000) {
      this.canUseCache = true
      return this
    }

    const ss = diff / 1000
    const mm = ss / 60
    const hh = mm / 60

    if (pkgDebug === true) {
      console.log('diff since last saved', {ss, mm, diff})
      console.log({cacheFile})
      console.log(cache)
    }

    if (hh > 1) {
      this.canBeUsed = false
    }
    else {
      this.canBeUsed = false
    }

    return this
  }

  /**
   * @return {DynamicDeps}
   */
  persist() {
    const deps = {time: Date.now(), deps: this.deps}
    const contents = JSON.stringify(deps)
    const cache = resolve(__dirname, './cache.json')

    if (pkgDebug === true) {
      console.log('going to persist cache:')
      console.log(cache)
    }

    try {
      writeFileSync(cache, contents, 'utf8')
    } catch (e) {
      if (pkgDebug === true) {
        console.log('could not write cache, not an issue')
        console.log(e)
      }
    }
    return this
  }

  /**
   * installs deps when all plugins have been added if needed
   * @see FlipLog.use
   * @return {FlipLog}
   */
  installIfNeeded() {
    if (this.deps.length !== 0) {
      console.log('installing missing deps:')
      console.log(this.deps.join(' '), '\n')

      const {execSync} = require('child_process')
      // we install this not inside the `fliplog` folder,
      // but inside parent node_modules
      // because node resolution
      // checks any parent folder that is named node_modules
      // otherwise when installed multiple times,
      // it will never persist the dep as the fliplog folder is cleared
      execSync('cd ../ && npm i ' + this.deps.join(' '), {stdio: 'inherit'})

      this.persist()
    }
    else if (this.wasBusted === true) {
      this.deps = this.resolvedDeps
      this.persist()
    }

    return this
  }
}
