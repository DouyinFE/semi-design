import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rstest/core';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

const unitTests = ['packages/semi-ui/**/__test__/**/*.{js,jsx,ts,tsx}'];
const storyTests = ['packages/semi-ui/**/_story/?(*.)+(stories).{js,jsx,ts,tsx}'];
const isStoryTest = process.env.type === 'story';
const testInclude = isStoryTest ? storyTests : unitTests;

export default defineConfig({
    plugins: [
        pluginReact({
            swcReactOptions: {
                runtime: 'classic',
            },
        }),
    ],
    globals: true,
    // Jest 24's pretty-format prints plain objects with their constructor name
    // (e.g. `Object {}`). Keep the existing Enzyme snapshot text stable.
    snapshotFormat: {
        printBasicPrototype: true,
    },
    // CSF files export stories but do not declare test blocks. Treat those
    // files as valid no-op suites, while keeping unit-test semantics strict.
    passWithNoTests: isStoryTest,
    include: testInclude,
    coverage: {
        provider: 'istanbul',
        include: ['packages/semi-ui/**/*.{js,jsx,mjs,ts,tsx}', 'packages/semi-foundation/**/*.{js,jsx,mjs,ts,tsx}'],
        exclude: [
            'packages/semi-ui/scripts/**',
            'packages/semi-ui/types/**',
            'packages/semi-foundation/scripts/**',
            'packages/**/__test__/**',
            'packages/**/_story/**',
            'packages/**/getBabelConfig.js',
            'packages/**/gulpfile.js',
            'packages/**/webpack.config.js',
            'packages/semi-ui/index.ts',
            'packages/**/_test_/**',
            'packages/**/dist/**',
            'packages/semi-ui/locale/**',
        ],
        reportsDirectory: './test/coverage',
    },
    setupFiles: ['./test/rstest.setup.js'],
    testEnvironment: {
        name: 'jsdom',
        options: {
            url: 'http://localhost/',
        },
    },
    source: {
        decorators: {
            version: 'legacy',
        },
    },
    tools: {
        rspack: config => {
            config.module = config.module || {};
            config.module.rules = config.module.rules || [];
            config.module.rules.unshift({
                test: /\.(css|scss)$/,
                type: 'javascript/auto',
                use: ['null-loader'],
            });
        },
    },
    resolve: {
        alias: {
            '@mdx-js/mdx$': path.resolve(rootDir, 'test/__mocks__/mdx-3.0.1-cjs.js'),
            'remark-gfm$': path.resolve(rootDir, 'test/__mocks__/remark-gfm-4.0.0-cjs.js'),
            '@testing-library/react$': path.resolve(rootDir, 'node_modules/@testing-library/react'),
            '@testing-library/dom$': path.resolve(rootDir, 'node_modules/@testing-library/dom'),
            '@douyinfe/semi-ui': path.resolve(rootDir, 'packages/semi-ui'),
            '@douyinfe/semi-foundation': path.resolve(rootDir, 'packages/semi-foundation'),
            '@douyinfe/semi-illustrations': path.resolve(rootDir, 'packages/semi-illustrations/src'),
            '@douyinfe/semi-icons': path.resolve(rootDir, 'packages/semi-icons/src'),
            '@douyinfe/semi-icons-lab': path.resolve(rootDir, 'packages/semi-icons-lab/src'),
            '@douyinfe/semi-json-viewer-core': path.resolve(rootDir, 'packages/semi-json-viewer-core/src'),
            '@douyinfe/semi-animation-styled': path.resolve(rootDir, 'packages/semi-animation-styled'),
            '@douyinfe/semi-animation-react': path.resolve(rootDir, 'packages/semi-animation-react'),
            '@douyinfe/semi-animation': path.resolve(rootDir, 'packages/semi-animation'),
            'lottie-web$': path.resolve(rootDir, 'test/__mocks__/lottie.js'),
            '@test': path.resolve(rootDir, 'test'),
            '@storybook/react$': path.resolve(rootDir, 'test/__mocks__/storyMock.js'),
        },
    },
});
