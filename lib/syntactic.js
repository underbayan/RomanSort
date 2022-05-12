
const { magneticType } = require('./tokenize')
exports.syntactic = (tokens) => {
    const length = tokens.length
    const blockList = []
    let mergedText = ""
    let previous
    const isUp = (previous, current) => (previous) && previous.magnetic !== magneticType.up && current.magnetic === magneticType.up
    const isDown = (previous, current) => current.magnetic === magneticType.down || current.scopeText === '\n'

    for (let i = 0; i < length; i++) {
        const item = tokens[i]
        if (isDown(previous, item))
        {
            mergedText += item.scopeText
            continue
        } else if (isUp(previous, item))
        {
            mergedText = previous.mergedText + item.scopeText
            Object.assign(previous, { mergedText })
            // blockList.push(previous)
            // previous = null
            mergedText = "" 
            continue
        }
        else {
            mergedText += item.scopeText
            previous = {mergedText, txt: trimTxt(item.scopeText || mergedText,), ...item}
            blockList.push(previous)
            mergedText = ""
        }
    }
    if (mergedText !== '') {
        blockList.push({mergedText, txt: trimTxt(mergedText), })
    }
    console.log(blockList)
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
