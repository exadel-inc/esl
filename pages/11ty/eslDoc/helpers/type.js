const ts = require('typescript');
const {
  getArgumentsList,
  getArgumentsSignature,
  getDeclarationName,
  getJSDocFullText,
  getGenericTypes,
  getMemberList,
  getTypeSignature
} = require('./common');

function getAlias(declaration) {
  if (ts.isUnionTypeNode(declaration.type)) return getUnionType(declaration);
  if (ts.isTypeLiteralNode(declaration.type)) return getTypeLiteral(declaration);
  if (ts.isFunctionTypeNode(declaration.type)) return getFunctionType(declaration);
}

function getUnionType(declaration) {
  const declarationObj = {
    type: 'Type alias',
    name: getDeclarationName(declaration),
    signature: `${this.name} = ${declaration.type.getText()}`,
    comment: getJSDocFullText(declaration),
  };
  return Object.assign(declarationObj, {signature: `${declarationObj.name} = ${declaration.type.getText()}`});
}

function getTypeLiteral(declaration) {
  const declarationObj = {
    type: 'Type alias',
    name: getDeclarationName(declaration),
    comment: getJSDocFullText(declaration),
    typeParameters: getGenericTypes(declaration),
    parameters: getMemberList(declaration.type)
  };
  const signature = getAliasSignature(declarationObj);
  return Object.assign(declarationObj, {signature});
}

function getAliasSignature(declaration) {
  const {name, typeParameters} = declaration;
  return `${name} ${typeParameters ? `<${typeParameters.signature}>` : ''}`;
}

function getFunctionType(declaration) {
  const declarationObj = {
    type: 'Function type',
    name: getDeclarationName(declaration),
    comment: getJSDocFullText(declaration),
    typeParameters: getGenericTypes(declaration),
    parameters: getArgumentsList(declaration.type),
    returnType: getTypeSignature(declaration.type)
  };
  const signature = getFunctionTypeSignature(declarationObj);
  return Object.assign(declarationObj, {signature});
}

function getFunctionTypeSignature (declaration) {
  const {name, typeParameters, returnType} = declaration;
  const parameters = getArgumentsSignature(declaration.parameters);
  return `type ${name}${typeParameters ? `<${typeParameters.signature}>` : ''}(${parameters || ''})${returnType ? `: ${returnType}` : ''}`;
}

module.exports = {getAlias};
