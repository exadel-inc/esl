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
  if (ts.isTypeLiteralNode(declaration.type)) return getTypeLiteral(declaration);
  if (ts.isFunctionTypeNode(declaration.type)) return getFunctionType(declaration);
  return getDefaultType(declaration);
}

function getDefaultType(declaration) {
  const type = 'Type alias';
  const name = getDeclarationName(declaration);
  const comment = getJSDocFullText(declaration);
  const signature = `${name} = ${declaration.type.getText()}`;
  return {type, name, comment, signature};  
}

function getTypeLiteral(declaration) {
  const type = 'Type alias';
  const name = getDeclarationName(declaration);
  const comment = getJSDocFullText(declaration);
  const typeParameters = getGenericTypes(declaration);
  const parameters = getMemberList(declaration.type);
  const signature = `${name} ${typeParameters ? `<${typeParameters.signature}>` : ''}`;
  return {type, name, comment, typeParameters, parameters, signature};
}

function getFunctionType(declaration) {
  const type = 'Function type';
  const name = getDeclarationName(declaration);
  const comment = getJSDocFullText(declaration);
  const typeParameters = getGenericTypes(declaration);
  const parameters = getArgumentsList(declaration.type);
  const returnType = getTypeSignature(declaration.type);
  const argsSignature = getArgumentsSignature(parameters);
  const signature = `type ${name}${typeParameters ? `<${typeParameters.signature}>` : ''}(${argsSignature})${returnType ? `: ${returnType}` : ''}`;
  return {type, name, comment, typeParameters, parameters, returnType, signature};
}

module.exports = {getAlias};
