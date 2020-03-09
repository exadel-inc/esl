const DeclarationBundlerPlugin = require('declaration-bundler-webpack-plugin');

let generateCombinedDeclaration = DeclarationBundlerPlugin.prototype.generateCombinedDeclaration;
DeclarationBundlerPlugin.prototype.generateCombinedDeclaration = function (declarationFiles) {
    for (let fileName in declarationFiles) {
        if (!Object.hasOwnProperty.call(declarationFiles, fileName)) continue;
        let declarationFile = declarationFiles[fileName];
        declarationFile._value = declarationFile._value || declarationFile.source();
    }
    return generateCombinedDeclaration.call(this, declarationFiles);
};

module.exports = DeclarationBundlerPlugin;