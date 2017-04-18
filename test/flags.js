// cannot seem to pass flags into postinstall script when installing
// e.g. FLIPLOG=TRUE npm install fliplog@0.2.0-beta.10 --save -- --fliplogs=true -- --fliplogs2=true -- --fliplogs3=true
//
// ways to achieve this:
//
// 1. add tags for feature flags, e.g.,
//  - `npm publish --tag magic`
//  - `npm i --save fliplog@magic`
// 2. postinstall hooks t
// - to install dependencies dynamically
// - then cache them
//
// 3. make users install the deps
// 4. interactive cli on postinstall, but would cause issues on things like travis
//
console.log('ARGV FLAGS!!!')
console.log(process.argv)
console.log('----- ENV ----')
console.log(process.env.FLIPLOG)
