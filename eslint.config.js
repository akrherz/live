import js from '@eslint/js';
import globals from 'globals';

export default [
    {
        ignores: ['dist/**', 'tests/**'],
    },
    js.configs.recommended,
    {
        files: ['**/*.js'],
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
            'prefer-const': 'error',
            semi: 'error',
        },
    },
];
