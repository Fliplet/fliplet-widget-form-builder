// Flat ESLint configuration (ESLint v9) for Fliplet Form Builder
// Converted from legacy .eslintrc style; no parserOptions key used.

const js = require('@eslint/js');

module.exports = [
  // Global ignores (migrated from .eslintignore)
  {
    ignores: [
      'node_modules/**',
      'vendor/**',
      'dist/**',
      '**/*.min.js',
      'js/build.templates.js',
      'js/interface.templates.js'
    ]
  },
  // Base recommended rules
  js.configs.recommended,
  // Project specific adjustments
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: {
        Fliplet: 'readonly',
        Vue: 'readonly',
        Handlebars: 'readonly',
        T: 'readonly',
        $: 'readonly'
      }
    },
    rules: {
      // Match existing project style
      eqeqeq: 'off',
      'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }]
    }
  }
];
