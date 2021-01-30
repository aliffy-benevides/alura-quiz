module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'react/jsx-first-prop-new-line': [0],
    'react/jsx-max-props-per-line': [0],
    'react/jsx-one-expression-per-line': [0],
    'react/jsx-props-no-spreading': [0],
    'react/jsx-closing-bracket-location': [0],
    'comma-dangle': 0
  },
};
