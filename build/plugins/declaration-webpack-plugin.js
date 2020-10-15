const path = require('path');

function DeclarationPlugin(options) {
  if (options === void 0) {
    options = {};
  }
  this.baseDir = options.baseDir;
}

DeclarationPlugin.prototype.apply = function (compiler) {
  //when the compiler is ready to emit files
  compiler.hooks.emit.tap('DeclarationPlugin', (compilation) => {
    // Fallback for base directory
    this.baseDir = this.baseDir || compilation.options.context;

    //collect all generated declaration files
    //and remove them from the assets that will be emited
    const declarationFiles = this.extractDeclarationFiles(compilation);

    Object.values(compilation.chunks)
      .forEach((chunk) => {
        const fileName = `${chunk.name}.d.ts`;
        const chunkDeclarationFiles = this.collectEntryDeclarationFiles(chunk);
        const internalDeclarations = this.collectInternalDeclarationFiles(
          chunkDeclarationFiles,
          declarationFiles
        );

        const internalDeclarationNames = internalDeclarations.map((dec) => dec.filename);
        console.log(`Compose declaration for '${fileName}' using: ${internalDeclarationNames.join(', ')}`);

        //combine into one declaration file
        const combinedDeclaration = this.generateCombinedDeclaration(internalDeclarations);

        //insert declaration asset
        compilation.assets[fileName] = {
          source: () => combinedDeclaration,
          size: () => combinedDeclaration.length
        };
      });
  });
};

DeclarationPlugin.prototype.extractDeclarationFiles = function (compilation) {
  const exposedDeclarations = new Map();
  Object.keys(compilation.assets)
    .filter(filename => filename.indexOf('.d.ts') !== -1)
    .forEach((filename) => {
      exposedDeclarations.set(filename, compilation.assets[filename]);
      delete compilation.assets[filename];
    });
  return exposedDeclarations;
};

DeclarationPlugin.prototype.collectEntryDeclarationFiles = function (entry) {
  return entry.getModules().reduce((declarationFileSet, module) => {
    if (module && module.buildInfo && module.buildInfo.fileDependencies) {
      module.buildInfo.fileDependencies.forEach((decKey) => {
        declarationFileSet.add(decKey.replace(/(\.d)?\.ts$/, '.d.ts'))
      });
    }
    return declarationFileSet;
  }, new Set());
};

DeclarationPlugin.prototype.collectInternalDeclarationFiles = function (entryFileList, exposedDeclarations) {
  const files = [];
  (entryFileList || []).forEach((declarationEntry) => {
    if (/[/\\]node_modules/.test(declarationEntry)) return;
    const relName = path.relative(this.baseDir, declarationEntry);
    if (exposedDeclarations.has(relName)) {
      files.push({
        file: exposedDeclarations.get(relName),
        filename: relName
      });
    }
  });
  return files;
};

DeclarationPlugin.prototype.generateCombinedDeclaration = function (declarationFiles) {
  return declarationFiles
    .map(({file}) => file._value || file.source())
    .map((content) => this.processDeclarationContent(content))
    .join('\n');
};

DeclarationPlugin.prototype.processDeclarationContent = function (data) {
  return data.split('\n')
    .filter((line) => {
      if (!line || !line.trim()) return false;
      if (/import\s.+;/.test(line)) return false;
      if (/export\sdefault.+;/.test(line)) return false;
      return true;
    })
    .join('\n');
};

module.exports = DeclarationPlugin;
