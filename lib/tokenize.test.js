
const { lexer } = require('./tokenize')
const { javascript } = require('./mock')
const assert = require('assert')
const tokens = lexer(javascript)
tokens.filter(r => r).map(r => r.scopeText).map(r => console.log(r))
assert(tokens.map(r => r.scopeText).join("") === javascript)
