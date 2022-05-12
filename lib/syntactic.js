
const { magneticType } = require('./tokenize')
exports.syntactic = (tokens) => {
    const length = tokens.length
    const blockList = []
    let mergedText = ""
    let previous
    const isUp = (previous, current) => !(previous && previous.scope & current.scope) && current.magnetic === magneticType.up
    const isDown = (previous, current) => !(previous && previous.scope & current.scope) && current.magnetic === magneticType.down || current.scopeText === '\n'

    for (let i = 0; i < length; i++) {
        const item = tokens[i]
        if (isDown(previous, item))
        {
            mergedText += item.scopeText
            previous = item
            continue
        } else if (isUp(previous, item))
        {
            mergedText = previous.mergedText + item.scopeText
            Object.assign(previous, { mergedText })
            mergedText = "" 
            continue
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
