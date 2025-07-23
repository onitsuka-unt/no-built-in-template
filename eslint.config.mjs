import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import astroParser from 'astro-eslint-parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintUnusedImports from 'eslint-plugin-unused-imports';

/** @type {import("eslint").Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    // グローバルに除外するファイルを指定（.eslintignoreに指定するのと同じ）
    ignores: ['.vscode', 'dist', 'scripts', '**/env.d.ts'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
  {
    files: ['*.astro'],

    languageOptions: {
      parser: astroParser,

      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
      },
    },
  },
  {
    plugins: {
      'unused-imports': eslintUnusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
    },
  },
  eslintConfigPrettier,
];
