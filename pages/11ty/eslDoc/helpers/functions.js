const {
  getDeclarationName,
  getJSDocFullText,
  getGenericTypes,
  getModifiers,
  getArgumentsList,
  getArgumentsSignature,
  getTypeSignature
} = require('./common');

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

  const signature = getFunctionSignature(declarationObj);
  return Object.assign(declarationObj, {signature});
}

function getFunction(declaration, output) {
  const lastDeclaration = output[output.length - 1];
  if (lastDeclaration && lastDeclaration.name === getDeclarationName(declaration)) {
    if (!declaration.body) {
      lastDeclaration.declarations.push(getFunctionDeclaration(declaration));
    } else {
      lastDeclaration.commonComment = getJSDocFullText(declaration);
    }
    return;
  }

  const functionDeclaration = getFunctionDeclaration(declaration);
  output.push({
    name: functionDeclaration.name,
    type: functionDeclaration.type,
    declarations: [functionDeclaration]
  });
  return;
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
  }

  const signature = getFunctionStatementSignature(declarationObj);
  return Object.assign(declarationObj, {signature});
}

function getFunctionStatementSignature (declaration) {
  const {name, typeParameters, returnType} = declaration;
  const parameters = getArgumentsSignature(declaration.parameters);
  return `const ${name} = ${typeParameters ? `<${typeParameters.signature}>` : ''}(${parameters || ''}) => ${returnType || 'void'}`;
}

module.exports = {
  getFunction,
  getFunctionDeclaration,
  getFunctionStatement
};
