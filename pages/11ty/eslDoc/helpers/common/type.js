const ts = require('typescript');
const {getDeclarationName} = require('./common');

function getTypeSignature(declaration) {
  const type = declaration.type;
  if (type) return type.getText();
  if (declaration.flags) return '';

  const statement = declaration.body?.statements?.filter((statement) => !!ts.isReturnStatement(statement));
  if (!(statement && statement.length)) return '';
  const expression = statement[0].expression;
  return `(${expression?.parameters?.map((parameter) => parameter.getText())}) => ${expression?.type?.getText()}`;
}

function getGenericTypes(declaration) {
  if (!declaration.typeParameters) return;
  const parameters = declaration.typeParameters.map((type) => {
    const name = getDeclarationName(type);
    return {name, signature: type.getText().split(name)[1]};
  });
  return {parameters, signature: parameters.map((parameter) => parameter.name).join('| ')};
}

module.exports = {
  getTypeSignature,
  getGenericTypes  
};
