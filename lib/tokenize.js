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
        etag: "`"
    },
    "/*": {
        parent: scopeType.normal,
        scope: scopeType.comment2,
        name: "comments",
        stag: '/*',
        etag: "*/"
    },
    "//": {
        parent: scopeType.normal,
        scope: scopeType.comment1,
        name: "comments",
        stag: '//',
        etag: "\n"
    },
    '"': {
        parent: scopeType.normal,
        scope: scopeType.quotation,
        name: "quotation",
        stag: '"',
        etag: '"'
    },
    "'": {
        parent: scopeType.normal,
        scope: scopeType.singleQuotation,
        name: "singleQuotation",
        stag: "'",
        etag: "'"
    },
    "[": {
        parent: scopeType.normal,
        scope: scopeType.normal,
        name: "bracketL",
        stag: '[',
        etag: "]"
    },
    "{": {
        parent: scopeType.normal,
        scope: scopeType.normal,
        name: "braceL",
        stag: '{',
        etag: "}",

    },
    "${": {
        parent: scopeType.template,
        scope: scopeType.normal,
        name: "dollarBraceL",
        stag: '${',
        etag: "}",
    },
}

const endMarix = {
    "`": {
        etag: "`",
        magneticGen: (str = "") => str.trim().indexOf("`") === 0 ? magneticType.up : "",
        scope: scopeType.template,
    },
    "*/": {
        etag: "*/",
        magneticGen: (str = "") => str.trim().indexOf("/*") === 0 ? magneticType.down : "",
        scope: scopeType.comment2,
    },
    "\n": {
        etag: "\n",
        magneticGen: (str = "") => str.trim().indexOf("//") === 0 ? magneticType.down : "",
        scope: scopeType.comment1,
    },
    '"': {
        etag: '"',
        magneticGen: (str = "") => str.trim().indexOf("\"") === 0 ? magneticType.up : "",
        scope: scopeType.quotation,
    },
    "'": {
        etag: "'",
        magneticGen: (str = "") => str.trim().indexOf("'") === 0 ? magneticType.up : "",
        scope: scopeType.singleQuotation,

    },
    "]": {
        etag: "]",
        magneticGen: (str = "") => str.trim().indexOf("[") === 0 ? magneticType.up : "",
        scope: scopeType.normal
    },
    "}": {
        etag: "}",
        magneticGen: (str = "") => str.trim().indexOf("{") === 0 ? magneticType.up : "",
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
        magnetic: "",
        ...clone(obj)
    }
}

exports.scopeType = scopeType
exports.magneticType = magneticType
exports.lexer = (str) => {
    const length = str.length
    const scopeStack = genStack()
    let scopeText = ""
    let currentRef = {}
    let previous = null
    const tokens = []

    const addTokens = (previous, current = {}) => {
        const magnetic = current && current.etag ? endMarix[current.etag].magneticGen(scopeText, previous) : ''
        tokens.push({ magnetic, scope: current.scope || scopeType.normal, scopeText })
        scopeText = ""
    }

    for (let i = 0; i < length; i++) {

        // Get first and second flags of line string
        const k = str[i]
        const kr = str[i + 1]

        // Current scope stack item
        const current = scopeStack.current()

        // Check whether to add new scope stack item or not
        const neo = startMatrix[`${k}${kr}`] || startMatrix[k] // priority two flags first
        const shouldEnterneo = neo && (!current || (current.scope & neo.parent))
        if (shouldEnterneo) {
            const item = genStackItem(neo, i)
            i += neo.stag.length - 1 // Change index if stag is more than 1 length
            scopeText += neo.stag
            scopeStack.push(item)
            continue
        }

        // Check whether to end current scope or not
        const hitEnd = endMarix[`${k}${kr}`] || endMarix[k]
        if (hitEnd && current && (hitEnd.scope & current.scope) && current.etag === hitEnd.etag) {
            scopeText += hitEnd.etag
            i += hitEnd.etag.length - 1 // Change index if stag is more than 1 length
            current.end = i
            currentRef = current
            scopeStack.pop()
        } else { // Else just join string 
            scopeText += k
        }

        if (k === '\n' && !scopeStack.current()) {
            addTokens(previous, currentRef)
            previous = currentRef
        }

    }
    if (scopeText !== "") addTokens(previous, currentRef)
    return tokens
}

