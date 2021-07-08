const { sortBy } = require("lodash")

exports.generator = (blockList, desc = false) => {
    return sortBy(blockList, ['firstLine'], [!desc ? 'asc' : 'desc']).map(r => r.mergedText).join("")
}

