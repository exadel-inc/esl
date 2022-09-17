const ts = require('typescript');
const eslDocCommon = require('./common');
const eslDocFunction = require('./functions');

function getClass(declaration) {
  const declarationObj = {
    name: eslDocCommon.getDeclarationName(declaration),
    type: 'Class',
    comment: eslDocCommon.getJSDocFullText(declaration),
    ...eslDocCommon.getModifiers(declaration),
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
      declarationObj.methods.push(eslDocFunction.getFunctionDeclaration(member));
      return;
    }

    if (ts.isPropertyDeclaration(member)) {
      declarationObj.properties.push(getPropertyDeclaration(member));
      return;
    }

    if (ts.isGetAccessorDeclaration(member)) {
      declarationObj.getAccessors.push(eslDocFunction.getFunctionDeclaration(member));
      return;
    }

    if (ts.isSetAccessorDeclaration(member)) {
      declarationObj.setAccessors.push(eslDocFunction.getFunctionDeclaration(member));
      return;
    }
  });

  if (!declarationObj.ctors.length)
    declarationObj.ctors.push({
      name: declarationObj.name,
      type: 'constructor',
      parameters: [],
      signature: `new ${declarationObj.name}(): ${declarationObj.name}`
    })

  return declarationObj;
}

function getConstructorSignature(ctor, name) {
  const parameters = ctor?.parameters && eslDocCommon.getArgumentsSignature(ctor.parameters);
  return `new ${name}(${parameters ?? ''}): ${name}`;
}

function getConstRuctorDeclaration(declaration, name) {
  const ctor = {
    name,
    type: 'constructor',
    ...eslDocCommon.getModifiers(declaration),
    parameters: eslDocCommon.getArgumentsList(declaration)
  }
  const signature = getConstructorSignature(ctor, name);
  return Object.assign(ctor, {signature});
}

function getPropertyDeclaration(declaration) {
  return {
    name: eslDocCommon.getDeclarationName(declaration),
    type: eslDocCommon.getTypeSignature(declaration),
    modifiers: eslDocCommon.getModifiers(declaration),
    defaultValue: declaration.initializer?.text,
    comment: eslDocCommon.getJSDocFullText(declaration)
  }
}

module.exports = {
  getClass
};
 