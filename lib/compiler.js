
const { generator } = require('./generator')
const { syntactic } = require('./syntactic')
const { lexer } = require('./tokenize')

function compiler(str, desc) {
    const tokens = lexer(str)
    const ast = syntactic(tokens)
    const output = generator(ast, desc)
    return output
}

exports.compiler = compiler
