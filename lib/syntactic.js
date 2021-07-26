
const { magneticType } = require('./tokenize')
exports.syntactic = (tokens) => {
    const length = tokens.length
    const blockList = []
    let mergedText = ""
    let previous
    for (let i = 0; i < length; i++) {
        const item = tokens[i]
        if (item.magnetic === magneticType.down || item.scopeText === '\n') {
            mergedText += item.scopeText
            continue;
        } else if (item.magnetic === magneticType.up) {
            mergedText = previous.mergedText + item.scopeText
            Object.assign(previous, { mergedText })
            mergedText = ""
            continue;
        }
        else {
            mergedText += item.scopeText
            previous = { mergedText, txt: trimTxt(item.scopeText || mergedText) }
            blockList.push(previous)
            mergedText = ""
        }
    }
    if (mergedText !== '') {
        blockList.push({ mergedText, txt: trimTxt(mergedText) })
    }
    return blockList
}
const trimTxt = (mergedText) => {
    // let temp = ""
    // const length = mergedText.length
    // let i = 0
    // while (i < length) {
    //     temp += mergedText[i] && mergedText[i].trim() || ''
    //     i++
    // }
    return mergedText ? mergedText.trim() : ''
}
