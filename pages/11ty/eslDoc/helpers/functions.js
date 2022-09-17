const eslDocCommon = require('./common');

function getFunctionDeclaration(declaration) {
  const declarationObj = {
    type: 'Function',
    name: eslDocCommon.getDeclarationName(declaration),
    comment: eslDocCommon.getJSDocFullText(declaration),
    typeParameters: eslDocCommon.getGenericTypes(declaration),
    modifiers: eslDocCommon.getModifiers(declaration),
    parameters: eslDocCommon.getArgumentsList(declaration),
    returnType: eslDocCommon.getTypeSignature(declaration),
  }

  const signature = getFunctionSignature(declarationObj);
  return Object.assign(declarationObj, {signature});
}

function getFunction(declaration, output) {
  const lastDeclaration = output[output.length - 1];
  if (lastDeclaration && lastDeclaration.name === declaration.name.escapedText) {
    if (!declaration.body) {
      const morphedDeclaration = getFunctionDeclaration(declaration);
      lastDeclaration.declarations.push(morphedDeclaration);
    } else {
      lastDeclaration.commonComment = eslDocCommon.getJSDocFullText(declaration);
    }
    return;
  }

  const morphedDeclaration = getFunctionDeclaration(declaration);
  output.push({
    name: morphedDeclaration.name,
    type: morphedDeclaration.type,
    declarations: [morphedDeclaration]
  });
  return;
}

function getFunctionStatement(declaration) {
  const statement = declaration.declarationList.declarations[0];
  const declarationObj = {
    type: 'Function statement',
    name: eslDocCommon.getDeclarationName(statement),
    comment: eslDocCommon.getJSDocFullText(declaration),
    typeParameters: eslDocCommon.getGenericTypes(statement.initializer),
    parameters: eslDocCommon.getArgumentsList(statement.initializer),
    returnType: eslDocCommon.getTypeSignature(statement.initializer)
  }

  const signature = getFunctionStatementSignature(declarationObj);
  return Object.assign(declarationObj, {signature});
}

function getFunctionSignature (declaration) {
  const {name, isAsync, typeParameters, returnType} = declaration;
  const parameters = eslDocCommon.getArgumentsSignature(declaration.parameters);
  return `${isAsync ? 'async' : ''}${name}${typeParameters ? `<${typeParameters.signature}>` : ''}(${parameters || ''})${returnType ? `: ${returnType}` : ''}`;
}

function getFunctionStatementSignature (declaration) {
  const {name, typeParameters, returnType} = declaration;
  const parameters = eslDocCommon.getArgumentsSignature(declaration.parameters);
  return `const ${name} = ${typeParameters ? `<${typeParameters.signature}>` : ''}(${parameters || ''}) => ${returnType || 'void'}`;
}

module.exports = {
  getFunction,
  getFunctionDeclaration,
  getFunctionStatement
};
