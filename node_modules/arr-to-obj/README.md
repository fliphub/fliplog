# array to object (arr to obj)
### convert arrays to objects

## default
#### (also can be used as valAsKeyAndVal)

```js
const arrToObj = require('arr-to-obj')
const obj = arrToObj(['eh', 'canada'])
// {eh: eh, canada: canada}
```

## valAsKey
```js
const {valAsKey} = require('arr-to-obj')
const obj = valAsKey(['eh', 'canada'], 'woot')
// {eh: 'woot', canada: 'woot'}
```

## valAsVal
```js
// @example:
// var array = ['eh', 'canada']
// valAsVal(array)
const {valAsVal} = require('arr-to-obj')
const obj = valAsVal(['eh', 'canada'])
// {'1': 'eh', '2': 'canada'}
```

## custom
```js
const arrToObj = require('arr-to-obj')
const arr = ['eh', 'canada']

// does the same as #valAsKey
// {eh: 'woot', canada: 'woot'}
const obj = arrToObj(array, {
  valFn: () => undefined,
  keyFn: ({i, val}) => typeof fn === 'function' ? fn(val, i) : (fn || i),
})
```

### resources
- https://www.npmjs.com/package/array-to-object (outdated, not customizable)
