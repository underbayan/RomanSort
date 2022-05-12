
const { compiler } = require('../../lib/compiler')
const { javascript2, javascript3, javascript3target } = require('./mock')
const assert = require('assert')
assert((javascript2.methods).length === compiler(javascript2.methods).length)

assert((javascript2.properties).length === compiler(javascript2.properties).length)

assert((javascript3).length === compiler(javascript3).length)
assert(compiler(javascript3, 1) == javascript3target)