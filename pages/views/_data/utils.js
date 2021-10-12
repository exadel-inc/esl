const json = require('../../../doc');

const getDetails = (item) =>{
    return {
        signatures: item.signatures ? item.signatures : [item],
    }
}

const sort = (data) => {
    const obj = {};
    data.children.forEach(item => {
        const object = {
          children : item.children ? sort(item) : getDetails(item),
          signatures : item.signatures ? item.signatures : [item],
          hasSignatures : item.signatures ? true : false,
          typeParameter : item.typeParameter,
          extendedTypes : item.extendedTypes,
          flags: item.flags ? item.flags : {},
          sources: item.sources ? item.sources[0] : {},
          comment : item.comment,
          name : item.name,
        }
        obj[item.kindString] ? obj[item.kindString].push(object) : obj[item.kindString] = [object];
    })
    return obj;

}
console.log(sort(json).Class[5].children.Property[6].children.signatures)
module.exports = sort(json)
