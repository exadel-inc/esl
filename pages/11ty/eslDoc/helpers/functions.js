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
  const type = 'Function';
  const name = getDeclarationName(declaration);
  const comment = getJSDocFullText(declaration);
  const typeParameters = getGenericTypes(declaration);
  const modifiers = getModifiers(declaration);
  const parameters = getArgumentsList(declaration);
  const returnType = getTypeSignature(declaration);
  const argsSignature = getArgumentsSignature(parameters);
  const signature = `${modifiers.isAsync ? 'async' : ''}${name}${typeParameters ? `<${typeParameters.signature}>` : ''}(${argsSignature})${returnType ? `: ${returnType}` : ''}`;
  return {type, name, comment, typeParameters, modifiers, parameters, returnType, signature};
}

function getFunctionStatement(declaration) {
  const statement = declaration.declarationList.declarations[0];
  const type = 'Function statement';
  const name = getDeclarationName(statement);
  const comment = getJSDocFullText(declaration);
  const typeParameters = getGenericTypes(statement.initializer);
  const parameters = getArgumentsList(statement.initializer);
  const returnType = getTypeSignature(statement.initializer);
  const argsSignature = getArgumentsSignature(parameters);
  const signature = `const ${name} = ${typeParameters ? `<${typeParameters.signature}>` : ''}(${argsSignature}) => ${returnType || 'void'}`;
  return {type, name, comment, typeParameters, parameters, returnType, signature};
}

module.exports = {
  addFunctionOverloads,
  getFunctionDeclaration,
  getFunctionStatement
};
