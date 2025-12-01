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
      // your custom rules here
    },
  }
);
