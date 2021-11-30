/* eslint-disable */
module.exports = {
    env: {
        'jest/globals': true,
        'browser': true,
        'node': true
    },
    settings: {
        react: {
            "version": "detect"
        }
    },
    extends: ["plugin:markdown/recommended"],
    overrides: [
        {
            files: ['*.js', '*.jsx'],
            extends: ['jest-enzyme', 'plugin:react/recommended', 'plugin:import/recommended', 'plugin:import/errors', 'plugin:import/warnings'],
            parser: '@babel/eslint-parser',
            plugins: ['react', 'react-hooks', 'jest', 'import'],
            rules: {
                // 因为历史原因，现有项目基本全部是4个空格
                indent: ['error', 4, { 'SwitchCase': 1 }],
                'react/display-name': 'off',
                'react/jsx-indent': ['error', 4],
                'react/jsx-indent-props': ['error', 4],
                'react/prefer-stateless-function': ['warn'],
                'react/no-find-dom-node': ['warn'],
                'react/prop-types': 'off',
                'react/prefer-stateless-function': 'off',
                'operator-linebreak': ['warn', 'after', { 'overrides': { '?': 'before', ':': 'before' } }],
                'import/no-unresolved': 'off',
                'semi': ['error', 'always'],
                'keyword-spacing': ["error", { "before": true, "after": true }]
            },
            globals: {
                "sinon": "readonly",
            },
        },
        {
            files: ['*.ts', '*.tsx'],
            excludedFiles: ['content/**'],
            extends: ['jest-enzyme', 'plugin:@typescript-eslint/recommended', 'plugin:import/typescript', 'plugin:react/recommended'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: ['./tsconfig.eslint.json'],
            },
            plugins: ['react', 'jest', 'react-hooks', 'import', '@typescript-eslint'],
            rules: {
                // 因为历史原因，现有项目基本全部是4个空格
                indent: 'off',
                '@typescript-eslint/indent': ['error', 4],
                'react/display-name': 'off',
                'react/jsx-indent': ['error', 4],
                'react/jsx-indent-props': ['error', 4],
                'react/prefer-stateless-function': ['warn'],
                'react/no-find-dom-node': ['warn'],
                'react/prop-types': 'off',
                'react-hooks/rules-of-hooks': 'error', 
                'react-hooks/exhaustive-deps': 'warn',
                'react/prefer-stateless-function': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/naming-convention': 'off',
                '@typescript-eslint/ban-ts-comment': 'off',
                '@typescript-eslint/no-var-requires': 'warn',
                '@typescript-eslint/no-inferrable-types': 'off',
                '@typescript-eslint/no-this-alias': 'off',
                 // In scenarios where specific rest props need to be passed, some keys may be taken out first, so set 'no-unused-vars' to off
                '@typescript-eslint/no-unused-vars': 'off',
                'import/no-unresolved': 'off',
                'semi': ['error', 'always'],
                'keyword-spacing': ["error", { "before": true, "after": true }]
            }
        },
    ],
};
