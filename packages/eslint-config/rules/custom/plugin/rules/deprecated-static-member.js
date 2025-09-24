export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'replace deprecated class static methods with recommended ones',
      recommended: true
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        patternProperties: {
          '.*': {
            type: 'object',
            patternProperties: {
              '.*': {
                anyOf: [
                  { type: 'string' },
                  {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      replacement: { type: 'string' }
                    },
                    required: ['replacement'],
                    additionalProperties: false
                  }
                ]
              }
            }
          }
        },
        additionalProperties: false
      }
    ]
  },
  create(context) {
    const mapping = context.options[0];
    if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) return {};
    if (!Object.keys(mapping).length) return {};
    return {
      MemberExpression(node) {
        const {object, property} = node;
        if (object.type !== 'Identifier' || property.type !== 'Identifier') return null;
        const memberMapping = (mapping[object.name] || {})[property.name];
        if (!memberMapping) return null;
        const replCfg = typeof memberMapping === 'function' ? memberMapping(node.parent) : memberMapping;
        const message = typeof replCfg === 'string' ? `${object.name}.${replCfg}` : replCfg.message;
        const replacement = typeof replCfg === 'string' ? replCfg : replCfg.replacement;
        context.report({
          node,
          message: `[ESL Lint]: Deprecated static method ${object.name}.${property.name}, use ${message} instead`,
          fix: replacement ? (fixer) => fixer.replaceText(node.property, replacement) : undefined
        });
        return null;
      }
    };
  }
};
