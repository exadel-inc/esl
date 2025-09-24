export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'replace deprecated path with a recommended one or use the library root & tree shaking',
      recommended: true
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        patternProperties: {
          '.*': {
            type: 'object',
            properties: {
              legacy: {
                anyOf: [
                  {type: 'string'},
                  {type: 'array', items: {type: 'string'}, minItems: 1}
                ]
              },
              path: {type: 'string'}
            },
            required: ['legacy', 'path'],
            additionalProperties: false
          }
        },
        additionalProperties: false
      }
    ]
  },
  create(context) {
    const mapping = context.options[0];
    if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) return {};

    // Transform config: {Alias: {legacy: string | string[], path: string}} into internal representation
    const entries = Object.entries(mapping)
      .map(([alias, value]) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
        const {legacy, path} = value;
        if (typeof path !== 'string') return null;
        if (typeof legacy !== 'string' && !Array.isArray(legacy)) return null;
        const deprecated = (typeof legacy === 'string' ? [legacy] : legacy).filter(p => typeof p === 'string');
        if (!deprecated.length) return null;
        return {alias, deprecated, path};
      })
      .filter(Boolean);

    if (!entries.length) return {};

    const byAlias = new Map(entries.map(e => [e.alias, e]));
    const processed = new WeakSet();
    const sourceCode = context.getSourceCode();

    return {
      ImportSpecifier(node) {
        const importedValue = node.imported;
        if (!importedValue || importedValue.type !== 'Identifier') return null;
        const record = byAlias.get(importedValue.name);
        if (!record) return null;
        const importDecl = node.parent; // ImportDeclaration
        const importedSource = importDecl.source && importDecl.source.value;
        if (typeof importedSource !== 'string') return null;
        if (!record.deprecated.includes(importedSource)) return null;
        if (processed.has(importDecl)) return null; // already fixed/report for this declaration

        context.report({
          node,
          message: `[ESL Lint]: Deprecated import path '${importedSource}' for ${record.alias}, use '${record.path}' instead`,
          fix(fixer) {
            processed.add(importDecl);
            const originalText = sourceCode.getText(importDecl.source);
            const quote = (/^(['"`]).*\1$/).test(originalText.trim()) ? originalText.trim()[0] : '\'';
            return fixer.replaceText(importDecl.source, `${quote}${record.path}${quote}`);
          }
        });
        return null;
      }
    };
  }
};
