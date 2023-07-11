const ts = require('typescript');
const {getJSDocComment, getJSDocFullText} = require('./jsDoc');
const {getDeclarationName} = require('./common');
const {getTypeSignature} = require('./type');

function getArgumentsList(declaration) {
  return declaration.parameters?.map((parameter) => getArgument(parameter)) || [];
}

function getMemberList(declaration) {
  return declaration.members?.map((member) => getArgument(member)) || [];
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
  };
}

function getArgumentsSignature (parameters) {
  return parameters?.map((parameter) => {
    const {name, type, isRest, isOptional} = parameter;
    return `${isRest ? '...' : ''}${name}${isOptional ? '?' : ''}${type ? `: ${type}` : ''}`;
  }).join(', ') || '';
}

module.exports = {
  getArgumentsSignature,
  getArgumentsList,
  getMemberList
};
