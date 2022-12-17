const ts = require('typescript');
const {getFunctionDeclaration, addFunctionOverloads} = require('./functions');
const {
  getDeclarationName,
  getJSDocFullText,
  getModifiers,
  getArgumentsSignature,
  getArgumentsList,
  getTypeSignature
} = require('./common');

function getClass(declaration) {
  const declarationObj = {
    name: getDeclarationName(declaration),
    type: 'Class',
    comment: getJSDocFullText(declaration),
    modifiers: getModifiers(declaration),
    ctors: [],
    methods: [],
    properties: [],
    getAccessors: [],
    setAccessors: []
  };

  declaration.members.forEach((member) => {
    if (ts.isConstructorDeclaration(member)) return declarationObj.ctors.push(getConstRuctorDeclaration(member, declarationObj.name));

    if (!(member.modifiers && ts.SyntaxKind[member.modifiers[0]?.kind] === 'PublicKeyword')) return;
    if (ts.isPropertyDeclaration(member)) return declarationObj.properties.push(getPropertyDeclaration(member));
    if (ts.isFunctionDeclaration(member) || ts.isMethodDeclaration(member)) return addFunctionOverloads(member, declarationObj.methods);
    if (ts.isGetAccessorDeclaration(member)) return declarationObj.getAccessors.push(getFunctionDeclaration(member));
    if (ts.isSetAccessorDeclaration(member)) return declarationObj.setAccessors.push(getFunctionDeclaration(member));
  });
  if (!declarationObj.ctors.length) declarationObj.ctors.push(getConstRuctorDeclaration(declaration));
  return declarationObj;
}

function getConstRuctorDeclaration(declaration, name = getDeclarationName(declaration)) {
  const type = 'constructor';
  const modifiers = getModifiers(declaration);
  const parameters = getArgumentsList(declaration);
  const signature = `new ${name}(${getArgumentsSignature(parameters)}): ${name}`;
  return {name, type, signature, modifiers, parameters};
}

function getPropertyDeclaration(declaration) {
  return {
    name: getDeclarationName(declaration),
    type: getTypeSignature(declaration),
    modifiers: getModifiers(declaration),
    defaultValue: declaration.initializer?.text,
    comment: getJSDocFullText(declaration)
  };
}

module.exports = {getClass};
