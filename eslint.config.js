const tsEslint = require('typescript-eslint');
const configPrettier = require('eslint-config-prettier');
const pluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const pluginSecurity = require('eslint-plugin-security');
const pluginNext = require('@next/eslint-plugin-next');
const globals = require('globals');

const nextConfig = {
  files: ['website/**/*.{js,ts,tsx}'],
  plugins: {
    '@next/next': pluginNext,
  },
  rules: {
    ...pluginNext.configs.recommended.rules,
    ...pluginNext.configs['core-web-vitals'].rules,
    // waiting for @next/eslint-plugin-next to support eslint flat pattern
    '@next/next/no-duplicate-head': 'off',
  },
};

module.exports = [
  ...tsEslint.configs.recommended,
  configPrettier,
  pluginPrettierRecommended,
  // 'plugin:sonarjs/recommended',
  pluginSecurity.configs.recommended,
  nextConfig,
  { files: ['**/*.js', '**/*./ts', '**/*./txs'] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    ignores: ['node_modules/*', '**/dist/*', '**/pnpm-lock.yaml', 'website/.next/*', '**/*.d.ts'],
  },
];
