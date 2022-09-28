const fs = require('fs');
const ts = require('typescript');
const path = require('path');
const {getFunction, getFunctionStatement} = require('./helpers/functions');
const {getClass} = require('./helpers/class');
const {isNodeExported} = require('./helpers/common');
const {getAlias} = require('./helpers/type');

class ESLDoc {
  static render (filePath) {
    const inputBuffer = fs.readFileSync(filePath).toString();
    const node = ts.createSourceFile(
      'class.ts',
      inputBuffer,
      ts.ScriptTarget.Latest,
      true
    );
  
    const renderOutput = [];
    ts.forEachChild(node, (declaration) => visitChild(declaration, renderOutput, filePath));
    return renderOutput;
  }
}

function visitChild (declaration, output, filePath) {
  if (ts.isExportDeclaration(declaration)) {
    const modulePath = `${path.join(path.dirname(filePath), declaration.moduleSpecifier.text)}.ts`;
    output.push(...ESLDoc.render(modulePath));
    return;
  }

  if (!isNodeExported(declaration)) return;

  if (ts.isClassDeclaration(declaration)) {
    output.push(getClass(declaration));
    return;
  }

  if (ts.isFunctionDeclaration(declaration)) {
    getFunction(declaration, output);
    return;
  }

  if (ts.isTypeAliasDeclaration(declaration)) {
    output.push(getAlias(declaration));
    return;
  }

  if (ts.isVariableStatement(declaration) && ts.isFunctionLike(declaration.declarationList.declarations[0].initializer)) {
    output.push(getFunctionStatement(declaration));
    return;
  }
}

module.exports.ESLDoc = ESLDoc;
