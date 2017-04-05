const log = require('../')

function cb(data) {
  if (!data || typeof data !== 'object') return data

  Object
    .keys(data)
    .forEach(key => {
      if (typeof data[key] === 'string')
        data[key] = data[key].replace(/\s{2}/gmi, ' ')
      else if (Array.isArray(data[key]))
        data[key] = data[key].map(a => cb(a.name))
    })

  return data
}

const fixture = {
  str: 'I  have  too  many  spaces',
  arr: [{name: 'eh'}, {noname: 'just undefined'}],
}

log
.formatter(cb)
.data(fixture)
.echo()
