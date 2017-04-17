var Benchmark = require('benchmark')
var suite = new Benchmark.Suite()
const newLogFn = require('../')
const oldLogFn = require('./_old')

const newFnFilter = () => {
  for (var i = 0; i < 10; i++) {
    newLogFn.filter('!me').text('me').tags('me').echo(false)
    newLogFn.filter('yup').text('yup').tags('yup').echo(false)
  }
}

const oldFnFilter = () => {
  for (var i = 0; i < 10; i++) {
    oldLogFn.filter('!me').text('me').tags('me').echo(false)
    oldLogFn.filter('yup').text('yup').tags('yup').echo(false)
  }
}

let cycles = []

suite
  .add('oldf', oldFnFilter)
  .add('newf', newFnFilter)
  .on('cycle', (event) => {
    console.log(String(event.target))
    cycles.push(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
    console.log('================')
    console.log(this.map(bnch => bnch.times.elapsed))
    console.log(cycles)
  })
 .run({'async': false})
