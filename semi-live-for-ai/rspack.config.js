const path = require('path');
const rspack = require('@rspack/core');
const ReactRefreshPlugin = require('@rspack/plugin-react-refresh');

const rootPath = path.join(__dirname, '..');
const packagesDir = path.join(rootPath, 'packages');

// 需要从源码编译的 packages
const sourcePackages = [
    path.join(packagesDir, 'semi-ui'),
    path.join(packagesDir, 'semi-foundation'),
    path.join(packagesDir, 'semi-icons/src'),
    path.join(packagesDir, 'semi-icons-lab/src'),
    path.join(packagesDir, 'semi-illustrations/src'),
    path.join(packagesDir, 'semi-animation'),
    path.join(packagesDir, 'semi-animation-react'),
    path.join(packagesDir, 'semi-animation-styled'),
    path.join(packagesDir, 'semi-json-viewer-core/src'),
];

// 使用函数形式导出，通过 argv.mode 可靠判断构建模式
module.exports = (env, argv) => {
    const isDev = argv.mode === 'development';
    
    return {
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'cheap-module-source-map' : 'source-map',
    experiments: {
        css: true,
    },
    entry: {
        main: './src/main.tsx'
    },
    output: {
        filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
        path: path.join(__dirname, 'dist'),
        publicPath: '',
        clean: true,
    },

    module: {
        rules: [
            // TypeScript/JavaScript - 使用 rspack 内置的 SWC
            {
                test: /\.[tj]sx?$/,
                include: [
                    path.join(__dirname, 'src'),
                    ...sourcePackages,
                ],
                loader: 'builtin:swc-loader',
                options: {
                    jsc: {
                        parser: {
                            syntax: 'typescript',
                            tsx: true,
                        },
                        transform: {
                            react: {
                                runtime: 'automatic',
                                development: isDev,
                                refresh: isDev,
                            },
                        },
                    },
                },
                type: 'javascript/auto',
            },
            // JavaScript from node_modules
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false,
                },
            },
            // SCSS/CSS
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin'],
                            },
                            additionalData: `@import "${path.join(packagesDir, 'semi-theme-default/scss/index.scss').replace(/\\/g, '/')}";`,
                        },
                    },
                ],
                type: 'css/auto',
            },
            // CSS
            {
                test: /\.css$/,
                type: 'css/auto',
            },
            // Images
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/i,
                type: 'asset/resource',
            },
        ]
    },

    optimization: {
        minimize: !isDev,
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                react: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: 'lib-react',
                    priority: 20,
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: 10,
                },
            },
        },
    },

    performance: {
        maxEntrypointSize: 10485760,
        maxAssetSize: 10485760,
        hints: isDev ? false : 'warning',
    },

    plugins: [
        new rspack.HtmlRspackPlugin({
            template: './index.html',
            inject: true,
        }),
        isDev && new ReactRefreshPlugin(),
    ].filter(Boolean),

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
            // 精确匹配（$）指向入口文件
            "@douyinfe/semi-ui$": path.join(packagesDir, "semi-ui/index.ts"),
            "@douyinfe/semi-foundation$": path.join(packagesDir, "semi-foundation/index.ts"),
            "@douyinfe/semi-icons$": path.join(packagesDir, "semi-icons/src/index.ts"),
            "@douyinfe/semi-icons-lab$": path.join(packagesDir, "semi-icons-lab/src/index.tsx"),
            "@douyinfe/semi-illustrations$": path.join(packagesDir, "semi-illustrations/src/index.ts"),
            "@douyinfe/semi-animation$": path.join(packagesDir, "semi-animation/index.ts"),
            "@douyinfe/semi-animation-react$": path.join(packagesDir, "semi-animation-react/index.ts"),
            "@douyinfe/semi-animation-styled$": path.join(packagesDir, "semi-animation-styled/index.ts"),
            "@douyinfe/semi-json-viewer-core$": path.join(packagesDir, "semi-json-viewer-core/src/index.ts"),
            "@douyinfe/semi-theme-default$": path.join(packagesDir, "semi-theme-default/scss/index.scss"),
            // 前缀匹配用于深层导入
            "@douyinfe/semi-ui": path.join(packagesDir, "semi-ui"),
            "@douyinfe/semi-foundation": path.join(packagesDir, "semi-foundation"),
            "@douyinfe/semi-icons": path.join(packagesDir, "semi-icons/src"),
            "@douyinfe/semi-icons-lab": path.join(packagesDir, "semi-icons-lab/src"),
            "@douyinfe/semi-illustrations": path.join(packagesDir, "semi-illustrations/src"),
            "@douyinfe/semi-animation": path.join(packagesDir, "semi-animation"),
            "@douyinfe/semi-animation-react": path.join(packagesDir, "semi-animation-react"),
            "@douyinfe/semi-animation-styled": path.join(packagesDir, "semi-animation-styled"),
            "@douyinfe/semi-json-viewer-core": path.join(packagesDir, "semi-json-viewer-core/src"),
            "@douyinfe/semi-theme-default": path.join(packagesDir, "semi-theme-default"),
            "react/jsx-runtime": path.join(require.resolve("react"), "..", "jsx-runtime.js"),
        },
    },

    devServer: {
        port: 3000,
        hot: true,
        open: false,
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, 'public'),
        },
    },
};
};
