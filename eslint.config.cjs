const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    {
        ignores: ['dist/**', 'tests/**', 'public/vendor/**'],
    },
    js.configs.recommended,
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                "Application": "readonly",
                "Ext": "readonly",
                "encode64": "readonly",
            },
        },
    },
    {
        rules: {
            curly: ['warn', 'all'],
            'dot-notation': 'warn',
            eqeqeq: 'warn',
            'init-declarations': ['warn', 'always'],
            'no-eval': 'warn',
            'no-var': 'warn',
            'no-restricted-syntax': [
                'error',
                {
                    selector: "Property[value.type='ArrowFunctionExpression']:has(ThisExpression)",
                    message: 'Do not use arrow functions for object properties that reference this. Use method shorthand or function syntax so this binds correctly.',
                },
            ],
            'prefer-const': 'error',
            'no-redeclare': 'error',
            'no-useless-assignment': 'error',
            semi: 'error',
            'no-shadow': 'error',
            'object-shorthand': ['error', 'always'],
        },
    },
];
