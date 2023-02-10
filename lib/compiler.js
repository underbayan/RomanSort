
const { generator } = require('./generator')
const { syntactic } = require('./syntactic')
const { lexer } = require('./tokenize')

function compiler (str, desc, caseInsensitive)
{
    const tokens = lexer(str)
    const ast = syntactic(tokens)
    const output = generator(ast, desc, caseInsensitive)
    return output
}

exports.compiler = compiler
