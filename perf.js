const level = require('level')
const flatfile = require('./index')
const Benchmark = require('benchmark')

const suite = new Benchmark.Suite()

suite.on('cycle', event => console.log(String(event.target)))
const add = (name, fn) => suite.add(name, fn, { defer: true })

const a = level('/tmp/mydb')
const b = flatfile('/tmp/my.db')

add('level-put', complete => {
  a.put('hello', {world: 1}, () => complete.resolve())
})

add('level-get', complete => {
  a.get('hello', (err, val) => {
    if (err) console.log(err)
    complete.resolve()
  })
})

b.on('open', () => {
  add('flatfile-put', complete => {
    b.put('hello', {world: 2}, () => complete.resolve())
  })

  add('flatfile-get', complete => {
    b.get('hello')
    complete.resolve()
  })

  suite.run({ 'async': true })
})

