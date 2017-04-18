const {OFF} = require('../deps')

module.exports = {
  // ----------------------------- spinner ------------------
  deps: {
    'multispinner': '0.2.1',
    'ora': '1.2.0',
  },

  // https://github.com/sindresorhus/log-update
  // https://github.com/sindresorhus/ora
  // https://github.com/sindresorhus/speed-test
  ora(options = {}, dots = 'dots1') {
    // const cliSpinners = require('cli-spinners')
    const ora = require('ora')
    ora.fliplog = this

    if (typeof options === 'string') {
      options = {text: options}
    }
    if (this.get('color') && !options.color) {
      options.color = this.get('color')
    }

    this.Spinner = ora(options)
    return this.Spinner
  },

  // @TODO: pr it to update examples...
  // https://www.npmjs.com/package/cli-spinner#demo
  // '<^>v'
  // '|/-\\'
  // spinner(message = 'flipping...', chars = )

  spinnerFactory(text = 'flipping...', opts = {}) {
    opts.text = text

    if (opts.ora) {
      delete opts.ora
      return this.ora(opts)
    }

    if (!opts.text.includes('%s')) opts.text = ' %s ' + text
    if (this.get('color') && !opts.color) {
      const colorFn = this.getLogWrapFn()
      opts.text = colorFn(opts.text)
    }

    const Spinner = require('../deps/Spinner')
    const spinner = new Spinner(opts)

    // to go back to chaining
    spinner.fliplog = () => this
    return spinner
  },

  // https://github.com/werk85/node-html-to-text
  startSpinners(frames = OFF) {
    let opts = {}

    // if (log.spinnersStarted) return this

    this.spinnersStarted = true
    if (frames === OFF) {
      // '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'.split('')
      opts.frames = [
        '[   ]',
        '[.  ]',
        '[.. ]',
        '[ ..]',
        '[  .]',
        '[   ]',
        '[=  ]',
        '[== ]',
        '[ ==]',
        '[  =]',
        '[   ]',
        '[-  ]',
        '[-- ]',
        '[ --]',
        '[  -]',
        '[   ]',
        '[~  ]',
        '[~~ ]',
        '[ ~~]',
        '[  ~]',
        '[   ]',
        '[*  ]',
        '[** ]',
        '[ **]',
        '[  *]',
      ]
    }
    else if (Array.isArray(frames)) {
      // else if (typeof frames === 'string') {
      //   opts.frames = frames
      // }
      opts.frames = frames
    }
    else if (typeof frames === 'object') {
      opts = frames
    }

    const Multispinner = require('multispinner')

    const spinners = Object.values(this.spinnerOpts)

    this.spinners = new Multispinner(spinners, opts)

    return this
  },

  stopSpinners() {
    this.spinnersStarted = false
    this.spinners.success()
    return this
  },

  addSpinner(name, text = 'flipping...', opts = {}) {
    opts.text = text
    this.spinners = this.spinners || {}
    this.spinnerOpts = this.spinnerOpts || {}
    this.spinnerOpts[name] = text

    return this
  },

  removeSpinner(name = 'all') {
    // safety
    this.spinners = this.spinners || {success() {}}

    if (name === 'all') {
      return Object.values(this.spinnerOpts).forEach(spinner =>
        this.removeSpinner(spinner)
      )
    }

    // key, value
    if (this.spinnerOpts[name]) name = this.spinnerOpts[name]

    this.spinners.success(name)

    return this
  },

  spinner(text = 'flipping...', opts = {}) {
    this.Spinner = this.spinnerFactory(text, opts)
    this.Spinner.start()
    return this
  },

  stopSpinner(clear = false) {
    if (clear) this.clear()
    if (!this.Spinner) return this
    this.Spinner.stop(clear)
    delete this.Spinner
    return this
  },
}
