import { RuleTester } from 'eslint';

import { rule } from '../src/eslint-plugin-require-node-import-prefix';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { ecmaVersion: 2022 },
});

ruleTester.run('no-empty-import-prefix', rule, {
  valid: [
    {
      code: `import { builtinModules } from 'node:module';`,
    },
    {
      code: `import { builtinModules } from 'node:module'`,
    },
    {
      code: `import fs from 'node:fs'`,
    },
  ],
  invalid: [
    {
      code: "import { builtinModules } from 'module';",
      output: "import { builtinModules } from 'node:module';",
      errors: [
        {
          messageId: 'invalidBuiltInImport',
          data: {
            moduleName: 'module',
          },
        },
      ],
    },
    {
      code: "import fs from 'fs'",
      output: "import fs from 'node:fs'",
      errors: [
        {
          messageId: 'invalidBuiltInImport',
          data: {
            moduleName: 'fs',
          },
        },
      ],
    },
  ],
});
