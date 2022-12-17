const ts = require('typescript');

function getDeclarationName(declaration) {
  return (declaration.name ? declaration.name.escapedText :
    `[${declaration.parameters.map((parameter) => parameter.getText()).join(', ')}]`) || '';
}

function getModifiers(declaration) {
  let isPublic = false;
  let isAsync = false;
  declaration.modifiers?.forEach((modifier) => {
    if (ts.SyntaxKind[modifier.kind] === 'PublicKeyword') isPublic = true;
    if (ts.SyntaxKind[modifier.kind] === 'AsyncKeyword') isAsync = true;
  })
  return {isPublic, isAsync};
}

function isNodeExported(declaration) {
  return (ts.getCombinedModifierFlags(declaration) & ts.ModifierFlags.Export) !== 0;
}

module.exports = {
  getDeclarationName,
  getModifiers,
  isNodeExported
};
