const {getJSDocFullText} = require('./common/jsDoc');
const {getArgumentsSignature, getArgumentsList, getMemberList} = require('./common/arguments');
const {getDeclarationName, getModifiers, isNodeExported} = require('./common/common');
const {getTypeSignature, getGenericTypes} = require('./common/type');

module.exports = {
  getArgumentsSignature,
  getArgumentsList,
  getDeclarationName,
  getGenericTypes,
  getJSDocFullText,
  getMemberList,
  getModifiers,
  getTypeSignature,
  isNodeExported
};
