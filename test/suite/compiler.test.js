
const { compiler } = require('../../lib/compiler')
const { javascript2 } = require('./mock')
const assert = require('assert')
console.log(compiler(javascript2.methods, 0))
console.log((javascript2.methods).length, compiler(javascript2.methods).length)
assert((javascript2.methods).length === compiler(javascript2.methods).length)

console.log(compiler(javascript2.properties, 1))
console.log((javascript2.properties).length, compiler(javascript2.properties).length)
assert((javascript2.properties).length === compiler(javascript2.properties).length)
