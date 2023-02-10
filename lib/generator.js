const { sortBy } = require("lodash")

exports.generator = (blockList, desc = false, caseInsensitive = false) =>
{
    let list = sortBy(blockList, i => caseInsensitive && i.txt ? i.txt.toLowerCase() : i.txt)
    list = desc ? list.reverse() : list
    return list.map(r => r.mergedText).join("")
}

