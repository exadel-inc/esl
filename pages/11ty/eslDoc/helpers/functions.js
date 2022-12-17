const {
  getDeclarationName,
  getJSDocFullText,
  getGenericTypes,
  getModifiers,
  getArgumentsList,
  getArgumentsSignature,
  getTypeSignature
} = require('./common');

function addFunctionOverloads(declaration, output) {
  const lastDeclaration = output[output.length - 1];
  if (lastDeclaration && lastDeclaration.name === getDeclarationName(declaration)) {
    return declaration.body ?
      lastDeclaration.commonComment = getJSDocFullText(declaration) :
      lastDeclaration.declarations.push(getFunctionDeclaration(declaration));
  }

  const functionDeclaration = getFunctionDeclaration(declaration);
  output.push({
    name: functionDeclaration.name,
    type: functionDeclaration.type,
    declarations: [functionDeclaration]
  });
}

function getFunctionDeclaration(declaration) {
  const declarationObj = {
    type: 'Function',
    name: getDeclarationName(declaration),
    comment: getJSDocFullText(declaration),
    typeParameters: getGenericTypes(declaration),
    modifiers: getModifiers(declaration),
    parameters: getArgumentsList(declaration),
    returnType: getTypeSignature(declaration),
  }
  return Object.assign(declarationObj, {signature: getFunctionSignature(declarationObj)});
}

function getFunctionSignature (declaration) {
  const {name, isAsync, typeParameters, returnType} = declaration;
  const parameters = getArgumentsSignature(declaration.parameters);
  return `${isAsync ? 'async' : ''}${name}${typeParameters ? `<${typeParameters.signature}>` : ''}(${parameters || ''})${returnType ? `: ${returnType}` : ''}`;
}

function getFunctionStatement(declaration) {
  const statement = declaration.declarationList.declarations[0];
  const declarationObj = {
    type: 'Function statement',
    name: getDeclarationName(statement),
    comment: getJSDocFullText(declaration),
    typeParameters: getGenericTypes(statement.initializer),
    parameters: getArgumentsList(statement.initializer),
    returnType: getTypeSignature(statement.initializer)
  };
  const signature = getFunctionStatementSignature(declarationObj);
  return Object.assign(declarationObj, {signature});
}

function getFunctionStatementSignature (declaration) {
  const {name, typeParameters, returnType} = declaration;
  const args = getArgumentsSignature(declaration.parameters);
  return `const ${name} = ${typeParameters ? `<${typeParameters.signature}>` : ''}(${args || ''}) => ${returnType || 'void'}`;
}

module.exports = {
  addFunctionOverloads,
  getFunctionDeclaration,
  getFunctionStatement
};
