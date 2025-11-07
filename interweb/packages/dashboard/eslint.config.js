const path = require('path');

module.exports = [
  {
    ignores: [],
    languageOptions: {},
  },
  ...require(path.resolve(__dirname, '../../eslint.config.js')),
  {
    languageOptions: {
      globals: {
        React: 'readonly',
      },
    },
  },
];

