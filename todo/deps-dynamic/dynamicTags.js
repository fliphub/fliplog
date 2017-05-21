// @NOTE this file is not included in npm files
const {execSync} = require('child_process')
const {resolve} = require('path')
const {writeFileSync} = require('fs') // readFileSync, existsSync
let pkg = require('./package.json')

const pkgPath = resolve(__dirname, './package.json')
const ogPkg = JSON.stringify(pkg, null, 2)
const ogPkgObj = JSON.parse(ogPkg)

/**
 * @param  {string} tag
 * @return {void}
 */
function dynamicTag(tag) {
  try {
    execSync(`echo "module.exports = '${tag}'" > ./tagged.js`, {
      stdio: 'inherit',
    })
    pkg.version = ogPkgObj.version

    // @NOTE: ignoring this for now,
    // @example 0.2.0-beta.1
    //
    // so it would become
    // 0.2.0-beta.1-cli
    //
    // if (pkg.version.includes('-')) {
    //   pkg.version = pkg.version.split('-').shift()
    // }

    // add tag to version
    pkg.version += '-' + tag

    // save pkg
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8')

    console.log({tag, version: pkg.version})
    console.log(`npm publish --tag ${tag}`)

    // publish with tag
    execSync(`npm publish --tag ${tag}`, {stdio: 'inherit'})
  }
  catch (e) {
    // restore original
    writeFileSync(pkgPath, ogPkg, 'utf8')
  }
}

function last() {
  console.log('restoring')

  // restore original
  writeFileSync(pkgPath, ogPkg, 'utf8')

  // empty the dynamicTag
  execSync(`echo "module.exports = false" > ./tagged.js`, {stdio: 'inherit'})
}

['fun', 'formatting', 'debugging', 'cli'].forEach(tag => dynamicTag(tag))
last()
