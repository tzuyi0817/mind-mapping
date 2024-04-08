const tsEslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const pluginSecurity = require('eslint-plugin-security');

module.exports = [
  ...tsEslint.configs.recommended,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  // 'plugin:sonarjs/recommended',
  // pluginSecurity.configs.recommended,
  {
    ignores: ['node_modules', 'dist', 'pnpm-lock.yaml'],
  },
];
