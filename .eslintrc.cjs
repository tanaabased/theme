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
  overrides: [
    {
      files: ['**/*.vue'],
      rules: {
        // VitePress client composables and Vite query imports are valid at runtime but
        // are not fully understood by eslint-plugin-import's resolver.
        'import/named': 'off',
        'import/no-unresolved': ['error', { ignore: ['\\?raw$'] }],
      },
    },
  ],
  settings: {
    'import/resolver': {
      exports: true,
      node: true,
    },
  },
};
