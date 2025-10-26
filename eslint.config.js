/* eslint-env node */
const importPlugin = require('eslint-plugin-import');
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  importPlugin.configs.recommended,
  {
    rules: {
      'react/display-name': 'off',
    },
  },
]);
