const json = require('../../../doc');


const getDetails = (item) =>{
    return {
        const: item.flags.isConst,
        sources: item.sources ? item.sources[0] : {},
        signatures: item.signatures,
    }
}

const sort = (data) => {
    const obj = {};
    data.children.forEach(item => {
        const children = item.children ? sort(item) : getDetails(item);
        const name = item.name;
        obj[item.kindString] ? obj[item.kindString].push({children, name}) : obj[item.kindString] = [{children, name}];
    })
    return obj;

}

module.exports = sort(json)
