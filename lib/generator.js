const { sortBy } = require("lodash")

exports.generator = (blockList, desc = false) => {
    let list = sortBy(blockList, i => i.txt)
    list = desc ? list.reverse() : list
    return list.map(r => r.mergedText).join("")
}

