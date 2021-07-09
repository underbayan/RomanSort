const scopeType = {
    normal: 1, // {},(),[] 
    template: 2, // ``
    quotation: 4, //""
    singleQuotation: 8, //''
    string: 2 | 4 | 8,
    comment1: 16, // //
    comment2: 32,// /** */
    comment: 16 | 32
}

// Simple clone fun
const clone = obj => JSON.parse(JSON.stringify(obj))

const startMatrix = {
    "`": {
        parent: scopeType.normal,
        scope: scopeType.template,
        name: "templateLiterals",
        stag: "`",
        etags: ["`"]
    },
    "/*": {
        parent: scopeType.normal,
        scope: scopeType.comment2,
        name: "comments",
        stag: '/*',
        etags: ["*/"]
    },
    "//": {
        parent: scopeType.normal,
        scope: scopeType.comment1,
        name: "comments",
        stag: '//',
        etags: ["\n"]
    },
    '"': {
        parent: scopeType.normal,
        scope: scopeType.quotation,
        name: "quotation",
        stag: '"',
        etags: ['"']
    },
    "'": {
        parent: scopeType.normal,
        scope: scopeType.singleQuotation,
        name: "singleQuotation",
        stag: "'",
        etags: ["'"]
    },
    "[": {
        parent: scopeType.normal,
        scope: scopeType.normal,
        name: "bracketL",
        stag: '[',
        etags: ["]"]
    },
    "{": {
        parent: scopeType.normal,
        scope: scopeType.normal,
        name: "braceL",
        stag: '{',
        etags: ["}"],

    },
    "${": {
        parent: scopeType.template,
        scope: scopeType.normal,
        name: "dollarBraceL",
        stag: '${',
        etags: ["}"],
    },
}

const endMarix = {
    "`": {
        etag: "`",
        scope: scopeType.template,
    },
    "*/": {
        etag: "*/",
        scope: scopeType.comment2,
    },
    "\n": {
        etag: "\n",
        scope: scopeType.comment1,
    },
    '"': {
        etag: '"',
        scope: scopeType.quotation,
    },
    "'": {
        etag: "'",
        scope: scopeType.singleQuotation,

    },
    "]": {
        etag: "]",
        scope: scopeType.normal
    },
    "}": {
        etag: "}",
        scope: scopeType.normal | scopeType.template
    }
}

// Simple stack
const genStack = () => {
    const scopeStack = []
    return {
        pop: () => scopeStack.pop(),
        push: (e) => scopeStack.push(e),
        last: () => scopeStack[scopeStack.length - 1]
    }
}
const genStackItem = (obj, index) => {
    return {
        start: index, end: -1,
        ...clone(obj)
    }
}

exports.scopeType = scopeType
exports.lexer = (str) => {
    const length = str.length
    const scopeStack = genStack()
    let scopeText = ""
    let preScope = null
    const tokens = []

    const addTokens = (k, scope = scopeType.normal) => {
        // Hack fix for // logic
        if (scope & scopeType.comment) {
            scope = scopeText.trim().indexOf("//") === 0 || scopeText.trim().indexOf("/*") === 0 ? scopeType.comment1 : scopeType.normal
        }
        if (scopeText !== "" && (!scopeStack.last()) && (k === '\n')) {
            tokens.push({ scope, scopeText })
            scopeText = ""
        }
    }

    for (let i = 0; i < length; i++) {
        const k = str[i]
        const kr = str[i + 1]
        const currentScope = startMatrix[`${k}${kr}`] || startMatrix[k] // priority?
        const last = scopeStack.last()
        const shouldEnterNewScope = currentScope && (!last || (last.scope & currentScope.parent))
        if (shouldEnterNewScope) {
            const item = genStackItem(currentScope, i)
            i += currentScope.stag.length - 1 // Change index if stag is 2 length
            scopeText += currentScope.stag
            scopeStack.push(item)
            continue
        }
        const hitEnd = endMarix[`${k}${kr}`] || endMarix[k]
        if (hitEnd && last && (hitEnd.scope & last.scope) && (~last.etags.indexOf(hitEnd.etag))) {
            scopeText += hitEnd.etag
            i += hitEnd.etag.length - 1
            last.end = i
            preScope = last
            scopeStack.pop()
            addTokens(k, preScope.scope)
            continue
        }
        scopeText += k
        addTokens(k, preScope?.scope)
        preScope = last
    }
    addTokens("\n", preScope?.scope)
    return tokens
}

