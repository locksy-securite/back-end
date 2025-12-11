import tseslint from 'typescript-eslint';
import eslintPlugin from '@eslint/js';
import parser from '@typescript-eslint/parser';

export default tseslint.config(
  // ESLint recommended rules
  eslintPlugin.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser, // pass the imported parser object
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-unsafe-finally': 'error',
      'no-constant-condition': 'warn',
      'no-script-url': 'error',
    },
  }
);
