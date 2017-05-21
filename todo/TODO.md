
https://www.ibm.com/blogs/bluemix/2015/03/node-js-better-logging/
# lightweight
add lightweight mode (flipshake)

dont list dependencies,
install,
read pkg json for config,
then depflip,
use babel style presets + plugins
- if config is used, settings change, instead of failing, have safety
try to require, if false, don't pass through the middleware/preset/plugin

```js
"fliplog": {
  "todo": "",
  "presets": [
    "light/production",
    "fun",
    "debugging",
    "latest"
  ],
  "use": [
    "verbose",
    "color",
    "xterm",
    "chalk",

    "timer",
    "spinner", "ora",
    "multi-spinner",
    "box",
    "sparkly",
    "beep",
    "highlight",
    "!for-blacklist-instead-of-white",
    "table", "diff",
    "track", "trace",
    "json", "stringify",
    "sleep", "tosource",

    "register", "file",
    "story"
  ]
},
```


-----

// @TODO:
// - [x] add debugFor filters here
// - [ ] more formatting
//  - [ ] easy table
//  - [x] json
// - [ ] storyline
// - [ ] docs
// - [x] emoji by name - checkout existing ones
// - [ ] integrate an existing validator
// - [x] https://www.npmjs.com/package/boxen
// - [ ] https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-3-logger-interface.md





-----




- filter using .when with .whenFlag etc
- add cli interface to do logs from flags
- .level .setLevel for doing logs and filtering
- should create reference-and-dereference and attach fliplog to obj property
  - `log.silent(this.get('debug'))`



https://github.com/TooTallNate/ansi.js

https://github.com/chjj/blessed
https://github.com/sindresorhus/pkg-dir
https://github.com/sindresorhus/filenamify
https://github.com/yeoman/update-notifier
https://github.com/mikaelbr/node-notifier
https://github.com/jstrace/chart
https://github.com/sindresorhus/sparkly
https://github.com/visionmedia/node-progress
https://github.com/SamVerschueren/listr
https://www.npmjs.com/package/eazy-logger


https://www.npmjs.com/package/tfunk
https://www.npmjs.com/package/easy-table
https://www.npmjs.com/package/cli-highlight
https://github.com/AljoschaMeyer/vorpal-log
https://github.com/vorpaljs/awesome-vorpal
https://github.com/dthree/cash
https://github.com/sindresorhus/boxen

https://www.npmjs.com/package/beeper



http://docs.graylog.org/en/2.2/pages/gelf.html

psr-3, file formatting
