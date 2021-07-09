
const { scopeType } = require('./tokenize')
exports.syntactic = (tokens) => {
    const length = tokens.length
    const blockList = []
    let mergedText = ""
    for (let i = 0; i < length; i++) {
        const item = tokens[i]
        mergedText += item.scopeText
        if (item.scope & scopeType.comment || !item.scopeText.trim()) {
            continue;
        } else {
            blockList.push({ mergedText, scopeText: item.scopeText, firstLine: getFirstLineTextTrim(item.scopeText, mergedText) })
            mergedText = ""
        }
    }
    if (mergedText !== '') {
        blockList.push({ mergedText, scopeText: mergedText, firstLine: getFirstLineTextTrim(mergedText, mergedText) })
    }
    return blockList
}
const getFirstLineTextTrim = (txt, mergedText) => {
    const newTxt = txt?.trim() || mergedText
    let temp = ""
    const length = newTxt.length
    let i = 0
    while (i < length) {
        temp += newTxt[i]?.trim() || ''
        i++
    }
    return temp
}
