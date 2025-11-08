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
    // Keep dashboard in sync with repo defaults; add overrides here if needed
  },
};

