all rights and all that go to https://github.com/mozilla-rpweb/webpack-chain

`chainMapTill` lets you chain until the required keys are set via chains, or if they are passed in, then it auto returns `parent`

`chainedMapExtendable`
- has chains with `.extends` able to use `default` values when calling it
- also can add `prefixes` (default `no`) so if you use `cache` default `true`, it can add `noCache` which does the inverse
- set up for being chains of chains when you add a few decorating chains dynamically
