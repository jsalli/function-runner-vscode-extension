// @ts-check
/** @typedef {import('eslint').Linter.RuleEntry} RuleEntry */

export const commonIgnorePatterns = [
  '**/.eslintrc.js',
  '*.mjs',
  '*.cjs',
  'out/*',
  'dist/*',
  'publish/*',
  '**/@types/*',
  'tsconfig.tsbuildinfo',
  'webpack.*.js',
  'webpack.*.ts',
  'src/__tests__',
  'node_modules',
]
/** @type Partial<Record<string, RuleEntry>> */
export const commonRules = {
  'no-await-in-loop': 'error',
  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/no-misused-promises': 'error',
  '@typescript-eslint/naming-convention': [
    'error',
    {
      selector: 'default',
      format: ['camelCase', 'PascalCase'],
    },
    {
      selector: 'variable',
      format: ['camelCase', 'UPPER_CASE'],
    },
    {
      selector: 'parameter',
      format: ['camelCase'],
      leadingUnderscore: 'allow',
    },
    {
      selector: 'memberLike',
      format: ['camelCase', 'PascalCase', 'snake_case'],
    },
    {
      selector: 'memberLike',
      modifiers: ['private', 'protected', 'public'],
      format: ['camelCase'],
    },
    // Let the object property names be as is which require quites. Like "x-api-key", "application/json" and similar
    {
      selector: [
        'classProperty',
        'objectLiteralProperty',
        'typeProperty',
        'classMethod',
        'objectLiteralMethod',
        'typeMethod',
        'accessor',
        'enumMember',
      ],
      format: null,
      modifiers: ['requiresQuotes'],
    },
    {
      selector: 'typeLike',
      format: ['PascalCase'],
    },
  ],
  '@typescript-eslint/prefer-optional-chain': 'error',
  'no-console': 'error',
  'object-shorthand': 'error',
  'prefer-destructuring': 'error',
}
