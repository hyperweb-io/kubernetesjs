module.exports = {
  root: false,
  extends: [
    'next',
    'next/core-web-vitals',
    '../../.eslintrc.json',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Keep dashboard in sync with repo defaults; add overrides below
    '@typescript-eslint/no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@next/next/no-img-element': 'off',
    'jsx-a11y/alt-text': 'off',
  },
  overrides: [
    // Test and mock files: relax strictness to reduce noise
    {
      files: [
        '**/__tests__/**',
        '**/__mocks__/**',
        '**/e2e/**',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        'no-empty': 'off',
        'react-hooks/rules-of-hooks': 'off',
        'react-hooks/exhaustive-deps': 'off',
        '@typescript-eslint/triple-slash-reference': 'off',
        'jsx-a11y/alt-text': 'off',
      },
    },
    // Generated Next type shim
    {
      files: ['next-env.d.ts'],
      rules: {
        '@typescript-eslint/triple-slash-reference': 'off',
      },
    },
    // API route stubs often include intentional empty blocks while scaffolding
    {
      files: ['app/api/**/*.ts'],
      rules: {
        'no-empty': 'off',
      },
    },
    // Temporarily relax hook ordering in resources/hooks until queries are refactored
    {
      files: [
        'components/resources/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
      ],
      rules: {
        'react-hooks/rules-of-hooks': 'off',
        'no-empty': 'off',
      },
    },
    // Low-level agent loops can rely on intentional constant conditions
    {
      files: ['lib/agent/**/*.ts', 'lib/agents/**/*.ts'],
      rules: {
        'no-constant-condition': 'off',
      },
    },
  ],
};
