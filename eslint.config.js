import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },
];
