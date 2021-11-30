const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const DefinePlugin = webpack.DefinePlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WebpackBarPlugin = require('webpackbar');
const HashedModuleIdsPlugin = webpack.HashedModuleIdsPlugin;
const getBabelConfig = require('./getBabelConfig');

const rootPath = path.join(__dirname, '../..');
module.exports = function ({ minimize }) {
    return {
        mode: 'production',
        bail: true,
        devtool: 'source-map',
        entry: {
            index: ['./index.ts']
        },
        output: {
            filename: minimize ? 'semi-ui.min.js' : 'semi-ui.js',
            path: path.join(__dirname, 'dist/umd'),
            library: 'SemiUI',
            libraryTarget: 'umd'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    include: [
                        path.join(rootPath, 'packages/semi-ui'),
                        path.join(rootPath, 'packages/semi-foundation')
                    ],
                    use: [
                        {
                            loader: 'babel-loader',
                            options: getBabelConfig({ isESM: true })
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                happyPackMode: false,
                                appendTsSuffixTo: []
                            }
                        }
                    ]
                },
                { 
                    test: /semi-icons\/.+\.css$/,
                    loaders: 'null-loader'
                },
                { test: /\.scss$/, loaders: 'null-loader' },
            ]
        },
        optimization: {
            minimize: !!minimize,
            minimizer: [new TerserPlugin()]
        },
        performance: { maxEntrypointSize: 10485760, maxAssetSize: 5242880 },
        plugins: [
            new DefinePlugin({
                'process.env': { NODE_ENV: '"production"', PUBLIC_URL: undefined }
            }),
            new CaseSensitivePathsPlugin(),
            new WebpackBarPlugin(),
            new HashedModuleIdsPlugin()
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
        },
        externals: {
            react: {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react'
            },
            'react-dom': {
                root: 'ReactDOM',
                commonjs2: 'react-dom',
                commonjs: 'react-dom',
                amd: 'react-dom'
            }
        }
    };
};