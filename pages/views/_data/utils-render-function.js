const obj = {
  param: [],
  returns: [],
  typeParams: '',
};

const modifyName = (item) => {
  if(!item.name) return ``;
  let name = item.rest ? "..."+item.name : item.name;
  item.option || item.defaultValue ? name + "?" : name;
  return name;
};

const checkType = (item) => {
  const typeArg = item.typeArguments
  return item.declaration?.children ? item.declaration.children.map(i => {return {name: i.name, type: i.type.name}}) : item.type === 'reflection'?
  getReflection(item.declaration.signatures) : item.type === 'array' ?
  item.elementType.name + "[]" : typeArg && typeArg[0].type ===  "reflection"?
  getReflection(typeArg[0].declaration.signatures) : typeArg &&  typeArg[0].types ?
  `&lt; ${ typeArg[0].types.map(i => checkType(i)).join(' | ') }&gt;` : typeArg && typeArg[0].name ?
  item.name + `&lt; ${typeArg[0].name} &gt;` : item.types?
  item.types.map(item =>checkType(item)) : item.name ?
  item.name : String(item.value);
}



const getTypeParam = (obj) =>{
  return obj ? obj.map(item => {
    return{
        name : item.name,
        type: item.type?.name,
        default: item.default?.name,
    }
  }) : [];
}

const getReflection = (items) => {

  // obj.typeParams = '';
  // obj.param = [];
  // obj.returns = [];
  return items ? items.map(item => {
      const parameter = item.parameters? item.parameters.map(item => {
          return {
              rest: item.flags.isRest,
              option: item.flags.isOptional,
              name : item.name,
              type: checkType(item.type),
              defaultValue: item.defaultValue,
              comment: item.comment ? item.comment.text : '',
          }
      }) : [];
      const typeParameter = getTypeParam(item.typeParameter);
      const returns =  checkType(item.type);
      return {typeParameter, parameter, returns, comment: item.comment, name: item.name, defaultValue: item.defaultValue}
  }) : [];
};

const checkDefVal = (item) => item.defaultValue ? `=` + item.defaultValue : ``;

const checkParam = (item) => {
  const parameters = item.parameter ? item.parameter.map(a => `${modifyName(a)}: ${Array.isArray(a.type) ? a.type.join(` | `) : a.type}${checkDefVal(a)}`) : [];
  return `(${parameters.join(', ')}) => ${Array.isArray(item.returns) ?  item.returns.join(` | `) : item.returns}`;
};

const bindCreateParam = (item, type) => {

  item.type = Array.isArray(item) ? item : item.type;
  const name = modifyName(item);
  const str = `${ name ? name + ":" : '' } ${ typeof item === "string"? item : item.parameter ?
  checkParam( item ) : item.type[0].parameter ?
  checkParam( item.type[0] ) : Array.isArray(item.type) ?
  item.type.join(` | `) : item.type }`
  type === "params"? obj.param.push(str) : obj.returns.push(str);

  return str;
};

const checkObj = (item) => {
  return typeof item === 'object' && item !== null
}

module.exports = {
  createTapeParam(item){
    const str = `${item.name}${ item.type ? `: ` +  item.type: item.default  ? item.default : ``}`
    obj.typeParams = `&lt; ${item.name} &gt;`;
    return `<li>${str}</li>`
  },

  createSignature(){
    const str = `${obj.typeParams}(${obj.param.join(", ")}): ${obj.returns.join(' | ')}`
    obj.typeParams = '';
    obj.param = [];
    obj.returns = [];
    return str;
  },

  modifyName(item){
    let name = item.rest ? "..."+item.name : item.name;
    item.option || item.defaultValue ? name + "?" : name;
    return name;
  },

  createParam: bindCreateParam,

  getSignature: getReflection,

  checkSignature (item){
    return item.getSignature ? getReflection(item.getSignature) : getReflection(item.setSignature);
  },

  createParamAcces(items){
    if(checkObj(items[0])) return '{' + items.map(item => item.name + ':' + item.type).join('; ') + '}';
    return bindCreateParam(items);
  },

  checkObj: checkObj,

  getTypeParam:getTypeParam,

  checkType(item){
    return `<span>${checkType(item)}</span>`
  }
}
// module.exports.createParam = module.exports.createParam.bind(module.exports)
