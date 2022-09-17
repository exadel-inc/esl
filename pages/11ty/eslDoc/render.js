const fs = require('fs');
const ts = require('typescript');
const path = require('path');
const eslDocFunction = require('./helpers/functions');
const eslDocClass = require('./helpers/class');
const eslDocCommon = require('./helpers/common');
const eslDocType = require('./helpers/type');

class ESLDoc {
  static render (filePath) {
    const inputBuffer = fs.readFileSync(filePath).toString();
    const node = ts.createSourceFile(
      'class.ts',
      inputBuffer,
      ts.ScriptTarget.Latest,
      true
    );
  
    const docOutput = [];
    ts.forEachChild(node, (declaration) => visitChild(declaration, docOutput, filePath));
    return docOutput;
  }
}

function visitChild (declaration, output, filePath) {
  if (ts.isExportDeclaration(declaration)) {
    const modulePath = `${path.join(path.dirname(filePath), declaration.moduleSpecifier.text)}.ts`;
    output.push(...ESLDoc.render(modulePath));
    return;
  }

  if (!eslDocCommon.isNodeExported(declaration)) return;

  if (ts.isClassDeclaration(declaration)) {
    output.push(eslDocClass.getClass(declaration));
    return;
  }

  if (ts.isFunctionDeclaration(declaration)) {
    eslDocFunction.getFunction(declaration, output);
    return;
  }

  if (ts.isTypeAliasDeclaration(declaration)) {
    output.push(eslDocType.getAlias(declaration));
    return;
  }

  if (ts.isVariableStatement(declaration) && ts.isFunctionLike(declaration.declarationList.declarations[0].initializer)) {
    output.push(eslDocFunction.getFunctionStatement(declaration));
    return;
  }
}

module.exports.ESLDoc = ESLDoc;
