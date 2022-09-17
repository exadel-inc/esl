const ts = require('typescript');

function getJSDocFullText(declaration) {
  const jsDoc = declaration.jsDoc && declaration.jsDoc[0];
  if (!jsDoc) return;
  return {
    text: getJSDocComment(jsDoc),
    tags: getJSDocTags(jsDoc)
  };
}

function getJSDocComment(jsDoc) {
  const comment = jsDoc.comment;
  if (!comment) return;
  return typeof comment === 'string' ?
    comment :
    comment.map((commentText) => `${commentText.name?.escapedText ?? ''}${commentText.text ?? ''}`).join('');
}

function getJSDocTags(jsDoc) {
  return jsDoc.tags?.map((tag) => {
    const name = tag.tagName.escapedText;
    if (name === 'param') return;
    const comment = tag.comment;
    return {
      name,
      link: tag.name?.name.escapedText,
      text: typeof comment === 'string' ? comment : comment?.map((comment) => comment.text).join('\n')
    };
  });
}

function getArgumentsList(declaration) {
  return declaration.parameters?.map((parameter) => getArgument(parameter));
}

function getMemberList(declaration) {
  return declaration.members?.map((member) => getArgument(member));
}

function getArgument(parameter) {
  const tags = ts.getJSDocTags(parameter)[0];
  return {
    name: getDeclarationName(parameter),
    type: getTypeSignature(parameter),
    defaultValue: parameter.initializer?.getFullText(),
    isOptional: (!!parameter.questionToken || !!this.defaultValue),
    isRest: !!parameter.dotDotDotToken,
    comment: tags ? getJSDocComment(tags) : getJSDocFullText(parameter)
  }
}

function getArgumentsSignature (parameters) {
  return parameters?.map((parameter) => {
    const {name, type, isRest, isOptional} = parameter;
    return `${isRest ? '...' : ''}${name}${isOptional ? '?' : ''}${type ? `: ${type}` : ''}`;
  }).join(', ');
}

function getDeclarationName(declaration) {
  if (declaration.name) return declaration.name.escapedText;
  else return `[${declaration.parameters.map((parameter) => parameter.getText()).join(', ')}]`;
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

function getTypeSignature(declaration) {
  const type = declaration.type;
  if (type) return type.getText();

  if (declaration.flags) return '';
  let functionStatemnt;
  declaration.body?.statements?.forEach((statement) => {
    if (ts.isReturnStatement(statement)) {
      functionStatemnt = `(${statement.expression?.parameters?.map((parameter) => parameter.getText())}) => ${statement.expression?.type?.getText()}`;
    }
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

function isNodeExported(declaration) {
  return (ts.getCombinedModifierFlags(declaration) & ts.ModifierFlags.Export) !== 0
}

module.exports = {
  getJSDocFullText,
  getMemberList,
  getDeclarationName,
  getModifiers,
  getArgument,
  getArgumentsSignature,
  getArgumentsList,
  getGenericTypes,
  getTypeSignature,
  isNodeExported
};
