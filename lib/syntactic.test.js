
const { lexer } = require('./tokenize')
const { syntactic } = require('./syntactic')
const { javascript } = require('./mock')
const assert = require('assert')
const tokens = lexer(javascript)
const blockList = syntactic(tokens)
console.log(blockList)
assert(blockList.map(r => r.mergedText).join("") === javascript)
