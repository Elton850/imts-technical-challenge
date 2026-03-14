/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: null,
  },
  plugins: ['@typescript-eslint', 'playwright'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:playwright/recommended',
    'prettier',
  ],
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    'playwright/no-networkidle': 'off',
    'playwright/no-wait-for-selector': 'off',
    'playwright/no-conditional-in-test': 'off',
    'playwright/no-conditional-expect': 'off',
    'playwright/expect-expect': 'off',
  },
  ignorePatterns: ['node_modules/', 'playwright-report/', 'test-results/'],
};
