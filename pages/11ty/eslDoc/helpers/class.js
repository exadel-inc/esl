const ts = require('typescript');
const {getFunctionDeclaration} = require('./functions');
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
  }

  declaration.members.forEach((member) => {
    if (ts.isConstructorDeclaration(member)) {
      declarationObj.ctors.push(getConstRuctorDeclaration(member, declarationObj.name));
      return;
    }
    if (!(member.modifiers && ts.SyntaxKind[member.modifiers[0]?.kind] === 'PublicKeyword')) return;

    if (ts.isFunctionDeclaration(member) || ts.isMethodDeclaration(member)) {
      declarationObj.methods.push(getFunctionDeclaration(member));
      return;
    }

    if (ts.isPropertyDeclaration(member)) {
      declarationObj.properties.push(getPropertyDeclaration(member));
      return;
    }

    if (ts.isGetAccessorDeclaration(member)) {
      declarationObj.getAccessors.push(getFunctionDeclaration(member));
      return;
    }

    if (ts.isSetAccessorDeclaration(member)) {
      declarationObj.setAccessors.push(getFunctionDeclaration(member));
      return;
    }
  });

  if (!declarationObj.ctors.length)
    declarationObj.ctors.push(getDefaultConstructor(declarationObj));

  return declarationObj;
}

function getDefaultConstructor(declaration) {
  return {
    name: declaration.name,
    type: 'constructor',
    parameters: [],
    signature: `new ${declaration.name}(): ${declaration.name}`
  };
}

function getConstructorSignature(ctor, name) {
  const parameters = ctor?.parameters && getArgumentsSignature(ctor.parameters);
  return `new ${name}(${parameters ?? ''}): ${name}`;
}

function getConstRuctorDeclaration(declaration, name) {
  const ctor = {
    name,
    type: 'constructor',
    modifiers: getModifiers(declaration),
    parameters: getArgumentsList(declaration)
  }
  const signature = getConstructorSignature(ctor, name);
  return Object.assign(ctor, {signature});
}

function getPropertyDeclaration(declaration) {
  return {
    name: getDeclarationName(declaration),
    type: getTypeSignature(declaration),
    modifiers: getModifiers(declaration),
    defaultValue: declaration.initializer?.text,
    comment: getJSDocFullText(declaration)
  }
}

module.exports = {getClass};
