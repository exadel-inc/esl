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

    const byAlias = createAliasMap(mapping);
    if (!byAlias.size) return {};

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

function createAliasMap(mapping) {
  const result = new Map();
  if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) return result;

  for (const [alias, raw] of Object.entries(mapping)) {
    if (!raw || typeof raw !== 'object') continue;

    const {legacy, path} = raw;
    if (typeof path !== 'string') continue;

    const deprecated = [].concat(legacy).filter((v) => typeof v === 'string');
    if (!deprecated.length) continue;

    result.set(alias, {alias, deprecated, path});
  }
  return result;
}
