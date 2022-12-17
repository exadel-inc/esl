const fs = require('fs');
const ts = require('typescript');
const path = require('path');
const {addFunctionOverloads, getFunctionStatement} = require('./helpers/functions');
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
    node.statements.forEach((declaration) => visitChild(declaration, renderOutput, filePath));
    return renderOutput;
  }
}

function visitChild (declaration, output, filePath) {
  if (ts.isExportDeclaration(declaration)) {
    output.push(...ESLDoc.render(`${path.join(path.dirname(filePath), declaration.moduleSpecifier.text)}.ts`));
    return;
  }

  if (!isNodeExported(declaration)) return;
  if (ts.isClassDeclaration(declaration)) return output.push(getClass(declaration));
  if (ts.isFunctionDeclaration(declaration)) return addFunctionOverloads(declaration, output);
  if (ts.isTypeAliasDeclaration(declaration)) return output.push(getAlias(declaration));
  if (ts.isVariableStatement(declaration) && ts.isFunctionLike(declaration.declarationList.declarations[0].initializer))
    return output.push(getFunctionStatement(declaration));
}

module.exports.ESLDoc = ESLDoc;
