When extending objects in nodejs, Object.keys and Object.getOwnPropertyNames may not give you all of the methods on the object. Use expose hidden to re-expose the hidden methods.

```js
const exposeHidden = require('expose-hidden')
class Eh {
  hidden1() {}
  hidden2() {}
}
const eh = new Eh()
exposeHidden(eh, /* optional second arg is `thisArg` to rebind as needed */)
```
