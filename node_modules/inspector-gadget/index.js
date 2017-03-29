const inspector = require('./inspector')
const inspectorGadget = require('./inspector-gadget')

module.exports = {
  inspectorGadget,
  inspector,
  inspect: inspector,
}
