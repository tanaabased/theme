/* eslint-disable import/no-commonjs */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  env: {
    node: true,
    mocha: true,
    es2022: true,
  },
  plugins: ['import', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'plugin:vue/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
    'import/no-commonjs': 'error',
  },
  settings: {
    'import/resolver': {
      exports: true,
      node: true,
    },
  },
};
