
const { lexer, scopeType } = require('../../lib/tokenize')
const { javascript2 } = require('./mock')
const assert = require('assert')



const methodsTest = () => {
    const tokens = lexer(javascript2.methods)
    const TokensAssert = [
        {
            magnetic: '',
            scope: scopeType.comment2,
            scopeText: ` public a():void {} /** method a inline comments */\n`
        }, {
            magnetic: 'down',
            scope: scopeType.comment2,
            scopeText: `/**\n * outer commnets for c\n **/\n`
        }, {
            magnetic: '',
            scope: scopeType.normal,
            scopeText: `   public c(args: string[]): string {\n    /**\n     * inner commnets\n     **/\n}\n`
        }, {
            magnetic: 'down',
            scope: scopeType.comment1,
            scopeText: `// outer commnets for b\n`
        }, {
            magnetic: '',
            scope: scopeType.normal,
            scopeText: `  public b(args: int[]): /** inner commnets**/ int {\n    /** inner commnets**/\n}\n`
        }, {
            magnetic: '',
            scope: scopeType.normal,
            scopeText: `A = (args: int[])=> {\n    return {Av:{}}\n}\n`
        }
    ]
    tokens.filter(r => r).map((r, index) => {
        console.log(r)
        assert(r.scopeText === TokensAssert[index].scopeText)
        assert(r.magnetic === TokensAssert[index].magnetic)
        assert(r.scope === TokensAssert[index].scope)

    })
    assert(tokens.map(r => r.scopeText).join("") === javascript2.methods)
}


const valueTest = () => {
    const tokens = lexer(javascript2.properties)
    const TokensAssert = [
        {
            magnetic: '',
            scope: 32,
            scopeText: 'public d= ()=> void {} /** method d inline comments */\n'
        },
        {
            magnetic: '',
            scope: 1,
            scopeText: 'public a =[\n    {},\n    [], /** [] */\n    {} // inner {}\n]\n'
        },
        { magnetic: '', scope: 1, scopeText: '\n' },
        {
            magnetic: 'down',
            scope: 32,
            scopeText: '/** outer commnets for b */\n'
        },
        { magnetic: '', scope: 32, scopeText: 'public b =\n' },
        { magnetic: '', scope: 4, scopeText: '" 123"\n' },
        { magnetic: '', scope: 4, scopeText: 'public c=\n' },
        {
            magnetic: 'up',
            scope: 1,
            scopeText: '{\n    t: /** t */\n    {},\n\n}\n'
        },
        { magnetic: '', scope: 1, scopeText: '\n' },
        {
            magnetic: '',
            scope: 1,
            scopeText: 'public a1 =[\n{\n   r: {}\n}]\n'
        }
    ]

    tokens.filter(r => r).map((r, index) => {
        console.log(r, r.scopeText, TokensAssert[index].scopeText)
        assert(r.scopeText === TokensAssert[index].scopeText)
        assert(r.magnetic === TokensAssert[index].magnetic)
        assert(r.scope === TokensAssert[index].scope)
    })
}
// methodsTest()
valueTest()