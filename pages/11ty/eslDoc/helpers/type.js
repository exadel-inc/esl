const ts = require('typescript');
const eslDocCommon = require('./common');

function getAlias(declaration) {
  if (ts.isTypeLiteralNode(declaration.type)) return getTypeLiteral(declaration);

  if (ts.isFunctionTypeNode(declaration.type)) return getFunctionType(declaration);
}

function getTypeLiteral(declaration) {
  const declarationObj = {
    type: 'Type alias',
    name: eslDocCommon.getDeclarationName(declaration),
    comment: eslDocCommon.getJSDocFullText(declaration),
    typeParameters: eslDocCommon.getGenericTypes(declaration),
    parameters: eslDocCommon.getMemberList(declaration.type)
  }

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
    name: eslDocCommon.getDeclarationName(declaration),
    comment: eslDocCommon.getJSDocFullText(declaration),
    typeParameters: eslDocCommon.getGenericTypes(declaration),
    parameters: eslDocCommon.getArgumentsList(declaration.type),
    returnType: eslDocCommon.getTypeSignature(declaration.type)
  }

  const signature = getFunctionTypeSignature(declarationObj);
  return Object.assign(declarationObj, {signature});
}

function getFunctionTypeSignature (declaration) {
  const {name, typeParameters, returnType} = declaration;
  const parameters = eslDocCommon.getArgumentsSignature(declaration.parameters);
  return `type ${name}${typeParameters ? `<${typeParameters.signature}>` : ''}(${parameters || ''})${returnType ? `: ${returnType}` : ''}`;
}

module.exports = {
  getAlias
};
