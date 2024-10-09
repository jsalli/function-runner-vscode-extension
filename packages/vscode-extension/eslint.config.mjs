// @ts-check
/** @typedef {import('eslint').Linter.LanguageOptions} LanguageOptions,  */
/** @typedef {import('eslint')} SharedConfigurationSettings,  */

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { commonRules, commonIgnorePatterns } from '../../eslint.config.base.mjs'

export default [
  ...tseslint.config(
    // File ignore settings for all the following ESLint configs
    {
      ignores: commonIgnorePatterns,
    },
    {
      languageOptions: {
        parserOptions: {
          // Fix bug which causes Eslint to error about files which have not been found but not matched
          // https://github.com/typescript-eslint/typescript-eslint/issues/9749
          project: './tsconfig.eslint.json',
        },
      },
    },
    {
      files: ['src/**/*.ts'],
      extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
      rules: commonRules
    },
    {
      files: ['tests/**/*.ts'],
      extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
      rules: { ...commonRules, 'no-console': 'off' }
    },
    {
      files: ['webpack.config.ts', 'webpack.config.test.ts'],
      extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
      rules: commonRules
    },
    eslintPluginPrettierRecommended,
  ),
]
