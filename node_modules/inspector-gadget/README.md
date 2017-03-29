# inspector-gadget
> preconfigured nodejs util

## inspectorGadget
> configure what is exposed when inspecting

```js
const {inspectorGadget} = require('inspector-gadget')
class Eh {
  constructor() {
    this.inspect = inspectorGadget(this, ['property-to-ignore'])
  }
}
```

## inspector
```js
const {inspector} = require('inspector-gadget')
const inspected = inspector({
  some: {
    super: {
      deep: {
        data: {
          with: {
            colors: function() {
              this.array = ['with inspection with colors pre configured']
            }
          }
        }
      }
    }
  }
})
console.log(inspected)
```

### options
- if it fails to inspect, it will [javascript-stringify](https://www.npmjs.com/package/javascript-stringify)
- second arg is a number, how deep you want to go (default 30)
- 3rd arg is options to override pre-configured [nodejs util inspect options](https://nodejs.org/api/util.html#util_util_inspect_object_options)
