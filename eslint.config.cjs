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
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        atob: 'readonly',
        btoa: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        Image: 'readonly',
        structuredClone: 'readonly',

        // Third-party libraries (loaded via widget.json)
        Fliplet: 'readonly',
        Vue: 'readonly',
        Handlebars: 'readonly',
        moment: 'readonly',
        tinymce: 'readonly',
        Sortable: 'readonly',
        Modernizr: 'readonly',

        // Translation helper
        T: 'readonly',

        // jQuery
        $: 'readonly',
        jQuery: 'readonly',

        // Fliplet-specific canvas helpers
        TD: 'readonly',
        TN: 'readonly'
      }
    },
    rules: {
      // Match existing project style
      eqeqeq: 'off',
      'no-prototype-builtins': 'off',
      'no-case-declarations': 'off',
      'no-useless-escape': 'off',
      'no-extra-boolean-cast': 'off',
      'no-self-assign': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
    }
  }
];
