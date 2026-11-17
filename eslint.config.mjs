import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig({
  files: ['playwright.config.ts', 'src/**/*.ts'],

  languageOptions: {
    parserOptions: {
      projectService: true,
    },
  },

  extends: [js.configs.recommended, tseslint.configs.recommended],

  rules: {
    'no-empty-pattern': ['error', { allowObjectPatternsAsParameters: true }],
    '@typescript-eslint/no-floating-promises': 'error',
  },
});
