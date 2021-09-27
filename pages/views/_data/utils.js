const json = require('../../../doc');

const getDetails = (item) =>{
    return {
        flags: item.flags ? item.flags : {},
        sources: item.sources ? item.sources[0] : {},
        signatures: item.signatures ? item.signatures : [item],
    }
}

const sort = (data) => {
    const obj = {};
    data.children.forEach(item => {
        const children = item.children ? sort(item) : getDetails(item);
        const name = item.name;
        const comment = item.comment;
        obj[item.kindString] ? obj[item.kindString].push({children, name, comment}) : obj[item.kindString] = [{children, name, comment}];
    })
    return obj;

}

module.exports = sort(json)
