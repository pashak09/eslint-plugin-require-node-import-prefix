import { builtinModules } from 'node:module';

import { Rule } from 'eslint';
import * as ESTree from 'estree';

export const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce usage of node the `node:` prefix for nodejs built-ins',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      invalidBuiltInImport: `Import of built-in "{{ moduleName }}" module must use the "node:" prefix.`,
    },
    fixable: 'code',
  },
  create: (context: Rule.RuleContext): Rule.RuleListener => {
    return {
      ImportDeclaration(node: ESTree.ImportDeclaration): void {
        const { source } = node;

        if (source.type === 'Literal' && typeof source.value === 'string') {
          const moduleName = source.value;

          if (
            builtinModules.includes(moduleName) === true &&
            moduleName.startsWith('node:') === false
          ) {
            context.report({
              node: source,
              messageId: 'invalidBuiltInImport',
              fix: (fixer: Rule.RuleFixer): Rule.Fix =>
                fixer.replaceText(source, `'node:${moduleName}'`),
              data: {
                moduleName,
              },
            });
          }
        }
      },
    };
  },
};

module.exports.rules = {
  'no-empty-import-prefix': rule,
};
