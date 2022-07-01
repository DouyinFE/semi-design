// node_modules 中需要经过babel-jest处理的模块，在此声明
let ModuleNeedCompile2Cjs = [
    'lodash-es',
    'react-dnd',
    'dnd-core',
    'react-dnd-html5-backend'
].join('|');

let config = {
    // 单元测试环境根目录
    // rootDir: path.resolve(__dirname),
    verbose: true,
    transform: {
        // 将.js、jsx后缀的文件使用babel-jest处理
        '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': 'babel-jest',
        '^.+\\.svg$': '<rootDir>/test/__mocks__/svgTransform.js',
    },
    setupFilesAfterEnv: ['<rootDir>/node_modules/jest-enzyme/lib/index.js'],
    // 运行测试前可运行的脚本，比如注册enzyme的兼容
    setupFiles: ['<rootDir>/test/setup.js', 'jest-date-mock'],
    testEnvironment: 'jsdom',
    // 忽略出lodash-es、react-dnd、dnd-core外的node_modules中的所有内容，即node_modules中只有lodash-es、react-dnd、dnd-core需要被babel-jest处理
    transformIgnorePatterns: [`<rootDir>/node_modules/(?!(${ModuleNeedCompile2Cjs}))`],
    snapshotSerializers: ['enzyme-to-json/serializer'],
    // moduleDirectories: ["node_modules"],
    moduleNameMapper: {
        '\\.(css|scss)$': '<rootDir>/test/__mocks__/styleMock.js',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/test/__mocks__/fileMock.js',
        '@douyinfe/semi-ui(.*)$': '<rootDir>/packages/semi-ui/$1',
        '@douyinfe/semi-foundation(.*)$': '<rootDir>/packages/semi-foundation/$1',
        '@douyinfe/semi-illustrations(.*)$': '<rootDir>/packages/semi-illustrations/src/$1',
        '@douyinfe/semi-icons(.*)$': '<rootDir>/packages/semi-icons/src/$1',
        // 将semi-animation相关的直接指向它的cjs版本，这样不用再走一次babel-jest的编译
        '@douyinfe/semi-animation-styled(.*)$': '<rootDir>/packages/semi-animation-styled',
        '@douyinfe/semi-animation-react(.*)$': '<rootDir>/packages/semi-animation-react',
        '@douyinfe/semi-animation(.*)$': '<rootDir>/packages/semi-animation',
        //   'react-dnd': '<rootDir>/node_modules/react-dnd-cjs/lib/index.js',
        '@test(.*)$': '<rootDir>/test/$1',
        '@storybook/react': '<rootDir>/test/__mocks__/storyMock.js',
        //   '@storybook/addon-knobs': '<rootDir>/test/__mocks__/storyAddonMock.js',
    },
    testURL: 'http://localhost',
    // 是否收集测试覆盖率
    //   collectCoverage: true, // 是否收集测试时的覆盖率信息
    collectCoverageFrom: [
        'packages/semi-ui/**/*.{js,jsx,mjs,ts,tsx}',
        'packages/semi-foundation/**/*.{js,jsx,mjs,ts,tsx}',
        '!packages/semi-ui/scripts/**',
        '!packages/semi-ui/types/**',
        '!packages/semi-foundation/scripts/**',
        '!packages/**/__test__/**',
        '!packages/**/_story/**',
        "!packages/**/getBabelConfig.js",
        "!packages/**/gulpfile.js",
        "!packages/**/webpack.config.js",
        "!packages/semi-ui/index.ts",
        '!packages/**/_test_/**',
        '!packages/**/dist/**',
        '!packages/semi-ui/locale/**',
    ], // 哪些文件需要收集覆盖率信息
    coverageDirectory: '<rootDir>/test/coverage', // 输出覆盖信息文件的目录
    coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/packages/*/index.js'], // 统计覆盖信息时需要忽略的文件

    // A set of global variables that need to be available in all test environments
    globals: {
        globalThis: {}
    },

};

// 指定需要进行单元测试的文件匹配规则
switch (process.env.type) {
    case 'unit':
        config.testMatch = ['<rootDir>/packages/semi-ui/**/__test__/**/*.[j|t]s?(x)'];
        break;
    case 'story':
        config.testMatch = ['<rootDir>/packages/semi-ui/**/_story/?(*.)+(stories).[j|t]s?(x)'];
        break;
    default:
        // unit & story
        config.testMatch = [
            '<rootDir>/packages/semi-ui/**/__test__/**/*.[j|t]s?(x)',
            '<rootDir>/packages/semi-ui/**/_story/?(*.)+(stories).[j|t]s?(x)',
        ];
        break;
}

module.exports = config;
