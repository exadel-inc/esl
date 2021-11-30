module.exports = {
  parseJSON(json) {
    return Object.fromEntries(Object.entries(json).map(([entryname, entryvalue]) => [entryname, entryvalue.map((child) => parseItem(child))]));
  },
}

// Initial object is the same for every item
const getInitialObject = (item) => {
  return {
    name: (item.flags?.isRest) ? `...${item.name}` : item.name,
    kindString: item.kindString,
    ...(item.sources) && {sources: formateSources(item)},
    ...(item.comment) && {comment: item.comment},
    ...(item.typeParameter) && {typeParameters: formateTypeArray(item), typeParameter: formateTypeString(item.typeParameter),},
    ...(item.defaultValue) && {defaultValue: item.defaultValue},
    flags: item.flags
  };
}

const parseItem = (item) => {

  let parsedObject = getInitialObject(item);

  // Object generates differently depending on the kind
  switch(item.kindString) {
    case 'Interface':
      Object.assign(parsedObject, (item.signatures) && {signatures: formateSignaturesArray(item.signatures)}, {interface: getParametersChildren(item)});
      break;
    case 'Class':
    case 'Namespace':
      Object.assign(parsedObject, formateChildrenObject(item.children));
      break;
    case 'Variable':
      Object.assign(parsedObject, {Property: getParameter({type: item.type})});
      break;
    case 'Accessor':
      Object.assign(parsedObject, {signatures: formateSignaturesArray(item.getSignature, parsedObject)});
      break;
    case 'Method':
    case 'Function':
      Object.assign(parsedObject, {signatures: formateSignaturesArray(item.signatures, parsedObject)});
      break;
    case 'Constructor':
      Object.assign(parsedObject, {signatures: formateSignaturesArray(item.signatures)});
      break;
    case 'Type alias':
    default:
      // Case used for type aliases, type literals, parameters, etc. Type aliases can be function, object or just have types and not have signature at all
      if (item.type?.declaration?.signatures) {
        //Case for function
        Object.assign(parsedObject, {signatures: formateSignaturesArray(item.type.declaration.signatures, parsedObject)});
      } else if (item.type?.declaration?.children) {
        // Case for object
        Object.assign(parsedObject, getParametersChildren(item.type.declaration));
      } else if (item.type?.type === 'intersection' || item.type?.type === 'union') {
        // Case for item with multiple types
        Object.assign(parsedObject, {signature: getParameter(item)});
      }
      break;
  };

  // Some items have index signature (see ArrayLike type alias)
  if (item.type?.declaration?.indexSignature) {
    parsedObject.Property.push(formateIndexSignature(item.type.declaration.indexSignature));
  }

  return parsedObject;
}

const formateSignaturesArray = (signatures, parsedObject) => {
  // Functions can have multiple signatures
  return signatures.map((signature) => {
    const childrenObject = formateChildrenObject(signature.parameters);
    let initialObject = getInitialObject(signature);

    return {...childrenObject, signature: `(${childrenObject.signature})`, ...initialObject, ...parsedObject , returns: getParameter(signature)};
  });
}

const getParametersChildren = (signature) => {
  const returnObject = formateChildrenObject(signature.children);
  return Object.assign(returnObject, {signature: `{ ${returnObject.signature} }`})
}

// Get path where item is defined
const formateSources = (item) => item.sources.map((source) => `${source.fileName}:${source.line}`);

// Get type parameters
const formateTypeString = (typesArray) => {
  if (!typesArray) {
    return '';
  }

  const typeString = typesArray.map((type) => {
    const parsedType = getParameter({type: type});
    if (!type.type) {
      return type.name;
    }

    if (type.type === 'reflection') {
      return `${parsedType.signatures[0].signature} => ${parsedType.signatures[0].returns}`;
    } else {
      return parsedType;
    }
  
  }).join(', ');

  return `<${typeString}>`;
}

const formateTypeArray = (parameters) => {
  return parameters.typeParameter.map((parameter) => {
    const name = parameter.name;
    const type = parameter.type ? `: ${getParameter(parameter)}` : '';
    const defaultValue = parameter.default ? ` = ${parameter.default.name}` : ''
    return `${name}${type}${defaultValue}`
  });
}

const formateIndexSignature = (signature) => {
  return {signature: `[${formateChildrenObject(signature.parameters).signature}]: ${signature.type.name}`};
}

const formateChildrenObject = (properties) => {
  let parametersArray = {};
  let signature = '';

  properties?.forEach((property, index) => {
    const parameter = getParameter(property);
    const parameterSignature = formateParameterSignature(property, parameter);
    const type = parameter.signatures ? `${parameter.signatures[0].signature} => ${parameter.signatures[0].returns}` : parameter

    // Signature is all parameters written in one string
    signature = signature + parameterSignature + `${index + 1 < properties.length ? ', ' : ''}`;
  
    const parameterObject = (property.kindString === 'Method' || property.kindString === 'Function' || property.kindString === 'Constructor' || property.kindString === 'Accessor' || property.type?.type === 'reflection') ? {
      name: property.name + formateTypeString(property.typeParameter),
      type: type,
      ...parameter,
    } : {
      ...getInitialObject(property),
      signature: parameterSignature,
      type: type
    }

    // parameter Object is pushed into array
    const {kindString} = property;
    if (!parametersArray[kindString]) {
      parametersArray[kindString] = [];
    }
    parametersArray[kindString].push(parameterObject);
  });
  Object.assign(parametersArray, {signature: signature});
  return parametersArray;
}

// formates signature of a parameter
const formateParameterSignature = (property, parameter) => {
  const restFlag = property.flags?.isRest ? '...' : '';
  const optionalFlag = (property.flags?.isOptional || property.defaultValue) && property.kindString !== 'Variable' ? '?' : '';

  let type = '';
  if (property.kindString === 'Method') {
    type = 'any';
  } else {
    if (parameter?.signatures) {
      type = `${parameter.signatures[0].signature} => ${parameter.signatures[0].returns}`;
    } else {
      type = parameter;
    }
  }
  return `${restFlag}${property.name}${optionalFlag}: ${type}`;
};

const getParameter = (parametersObject) => {
  let parameter = '';

  if(!parametersObject.type?.type) {
    parameter = parseItem(parametersObject);
    return parameter;
  }

  switch(parametersObject.type.type) {
    case 'array':
      const arrayParams = getParameter({type: parametersObject.type.elementType});
      parameter = parametersObject.type.elementType.types ? `(${arrayParams})[]` : `${arrayParams}[]`;
      break;
    case 'reference':
      parameter = parametersObject.type.name + formateTypeString(parametersObject.type.typeArguments);
      break;
    case 'reflection':
      const parsedObject = parseItem(parametersObject);
      parameter = {...parsedObject, type: parsedObject.signatures ? `${parsedObject.signatures[0].signature} => ${parsedObject.signatures[0].returns}` : parsedObject};
      break;
    case 'literal':
      parameter = parameter + parametersObject.type.value;
      break;
    case 'union':
      parameter = parametersObject.type.types.map(type => {
        const parameter = getParameter({type: type});
        const parameterSignature = parameter.signature ? parameter.signature : parameter;
        return type.types ? `(${parameterSignature})` : `${parameterSignature}`;
      }).join(' | ');
      break;
    case 'intersection':
      parameter = parametersObject.type.types.map(type => {
        const parameter = getParameter({type: type});
        const parameterSignature = parameter.signature ? parameter.signature : parameter;
        return type.types ? `(${parameterSignature})` : `${parameterSignature}`;
      }).join(' & ');
      break;
    case 'tuple':
      parameter = '[]';
      break;
    case 'predicate':
      parameter = `${parametersObject.type.name} is ${getParameter({type: parametersObject.type.targetType})}`;
      break;
    default:
      parameter = parametersObject.type.name;
      break;
  };

  return parameter;
}
