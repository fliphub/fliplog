const interoplateRegExp = /%[sdj%]/g
const {OFF} = require('../deps')
// https://coderwall.com/p/blti_w/dumb-javascript-string-interpolation
// https://nodejs.org/api/util.html#util_util_format_format
// https://github.com/knowledgecode/fast-format
// http://stringjs.com/
// https://github.com/alexei/sprintf.js

const isOFF = x => x === OFF || (/undefined/).test(x)

module.exports = {
  reset() {
    this.delete('colorer')
  },
  /**
   * @see this.textFormatter
   * @desc strips asci chars from text, or as a text-formatter
   * @param {string} [text=null]
   * @return {FlipLog} @chainable
   */
  strip(text = null) {
    if (text !== null) this.text(text)

    return this
      .set('textFormatter', txt =>
        isOFF(txt) ? OFF : this.requirePkg('strip-ansi')(txt))
      .set('colorer', color => txt =>
        isOFF(txt) ? OFF : this.requirePkg('strip-ansi')(txt))
  },

  /**
   * @desc @modifies this.templates
   * @param {string} id=null (when only 1 arg, this is the template and id is random)
   * @param {string} [template=null]
   * @return {FlipLog} @chainable
   */
  addTemplate(id = null, template = null) {
    let args = {id, template}

    // single arg
    if (typeof id === 'string' && template === null) {
      args.template = id
      args.id = Math.random(0, 1000)
    }
    if (!this.has('templates')) this.set('templates', {})
    return this.set('templates.' + args.id, template).set(
      'templates.current',
      template
    )
  },

  /**
   * @see this.sprintf
   * @param {string} id dot.prop key of id on this.templates
   * @return {string} template for rendering
   */
  getTemplate(id) {
    return this.get('template.' + id)
  },

  /**
   * @see this.template
   * @see this.sprintf
   * @param {string} id dot.prop key of id on this.templates
   * @return {string} template for rendering
   */
  useTemplate(id) {
    return this.set('template.current', this.get('template.' + id))
  },

  /**
   * @desc pass in array to use the current template,
   *       or (id, array<string>) to render a specific template
   * @param {string} id dot.prop key of id on this.templates
   * @param {Array<string>} [args]
   * @return {FlipLog} @chainable
   */
  sprintf(id, ...args) {
    let templateArgs = args
    let templateId = 'current'

    // single or multi arg
    if (!Array.isArray(id)) templateId = id
    else templateArgs = id

    //  flatten
    if (Array.isArray(templateArgs[0])) {
      templateArgs = [].concat.apply([], templateArgs)
    }

    let template = this.get('template.' + templateId)

    if (Array.isArray(id)) {
      if (template) {
        const {vsprintf} = this.requirePkg('sprintf')
        const rendered = vsprintf
        return this.set('text', template)
      }
      else {
        let msg = 'when using sprintf, '
        msg += 'you must `useTemplate(id)`'
        msg += 'or at least `addTemplate(id, templateString)`'
        this.reset().color('red.bold.underline').text(msg).echo()
        return this
      }
    }
    if (this.has('template.' + id)) return this.set('text')
    return this
  },
}
