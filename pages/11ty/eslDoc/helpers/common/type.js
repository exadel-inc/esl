const ts = require('typescript');
const {getDeclarationName} = require('./common');

function getTypeSignature(declaration) {
  const type = declaration.type;
  if (type) return type.getText();
  if (declaration.flags) return '';

  let functionStatemnt;
  declaration.body?.statements?.forEach((statement) => {
    if (!ts.isReturnStatement(statement)) return;
    const expression = statement.expression;
    const parameters = expression?.parameters?.map((parameter) => parameter.getText());
    const type = expression?.type?.getText()
    functionStatemnt = `(${parameters}) => ${type}`;
  });
  return functionStatemnt;
}

function getGenericTypes(declaration) {
  if (!declaration.typeParameters) return;
  const parameters = declaration.typeParameters.map((type) => {
    const name = getDeclarationName(type);
    const signature = type.getText().split(name)[1];
    return {name, signature};
  });
  const signature = parameters.map((parameter) => parameter.name).join('| ');
  return {parameters, signature};
}

module.exports = {
  getTypeSignature,
  getGenericTypes  
};
