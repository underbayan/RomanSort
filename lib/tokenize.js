const scopeType = {
    normal: 1, // {},(),[] 
    template: 2, // ``
    quotation: 4, //""
    singleQuotation: 8, //''
    string: 2 | 4 | 8,
    comment1: 16, // //
    comment2: 32,// /** */
    comment: 16 | 32,
    value: 64// {},(),[] ,
}

const magneticType = { up: "up", down: "down", "": "" }

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
        magnetic: (str = "", preScope) => str.trim().indexOf("`") === 0 && (preScope & scopeType.normal) ? magneticType.up : "",
        scope: scopeType.template,
    },
    "*/": {
        etag: "*/",
        magnetic: (str = "") => str.trim().indexOf("/*") === 0 ? magneticType.down : "",
        scope: scopeType.comment2,
    },
    "\n": {
        etag: "\n",
        magnetic: (str = "") => str.trim().indexOf("//") === 0 ? magneticType.down : "",
        scope: scopeType.comment1,
    },
    '"': {
        etag: '"',
        magnetic: (str = "") => str.trim().indexOf("\"") === 0 ? magneticType.up : "",
        scope: scopeType.quotation,
    },
    "'": {
        etag: "'",
        magnetic: (str = "") => str.trim().indexOf("'") === 0 ? magneticType.up : "",
        scope: scopeType.singleQuotation,

    },
    "]": {
        etag: "]",
        magnetic: (str = "") => str.trim().indexOf("[") === 0 ? magneticType.up : "",
        scope: scopeType.normal
    },
    "}": {
        etag: "}",
        magnetic: (str = "") => str.trim().indexOf("{") === 0 ? magneticType.up : "",
        scope: scopeType.normal | scopeType.template
    }
}

// Simple stack
const genStack = () => {
    const scopeStack = []
    return {
        pop: () => scopeStack.pop(),
        push: (e) => scopeStack.push(e),
        current: () => scopeStack[scopeStack.length - 1]
    }
}
const genStackItem = (obj, index) => {
    return {
        start: index,
        end: -1,
        magneticType: "",
        ...clone(obj)
    }
}

exports.scopeType = scopeType
exports.lexer = (str) => {
    const length = str.length
    const scopeStack = genStack()
    let scopeText = ""
    let preStackItem = {}
    const tokens = []

    const addTokens = (k, scope = scopeType.normal) => {

        // Hack fix for // logic
        if (scope & scopeType.comment) {
            scope = scopeText.trim().indexOf("//") === 0 || scopeText.trim().indexOf("/*") === 0 ? scopeType.comment1 : scopeType.normal
        }
        if (scopeText !== "" && (!scopeStack.current()) && (k === '\n')) {
            tokens.push({ scope, scopeText })
            scopeText = ""
        }
    }

    for (let i = 0; i < length; i++) {
        const k = str[i]
        const kr = str[i + 1]
        const neo = startMatrix[`${k}${kr}`] || startMatrix[k] // priority two flags first
        const current = scopeStack.current()
        const shouldEnterneo = neo && (!current || (current.scope & neo.parent))
        if (shouldEnterneo) {
            const item = genStackItem(neo, i)
            i += neo.stag.length - 1 // Change index if stag is 2 length
            scopeText += neo.stag
            scopeStack.push(item)
            continue
        }
        const hitEnd = endMarix[`${k}${kr}`] || endMarix[k]
        if (hitEnd && current && (hitEnd.scope & current.scope) && (~current.etags.indexOf(hitEnd.etag))) {
            scopeText += hitEnd.etag
            i += hitEnd.etag.length - 1 // Change index if stag is 2 length
            current.end = i
            scopeStack.pop()
        } else {
            scopeText += k
        }
        addTokens(k, preStackItem.scope)
        preStackItem = current || {}
    }
    addTokens("\n", preStackItem.scope)
    return tokens
}

