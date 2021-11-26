const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const babelConfig = require('./babel.config');

const semiThemeLoader = path.resolve(__dirname, '../semi-webpack/lib/semi-theme-loader.js');

module.exports = function getWebpackConfig({ minimize }){
    return {
        mode: 'production',
        bail: true,
        devtool: 'source-map',
        entry: {
            index: ['./src/index.ts']
        },
        output: {
            filename: minimize ? 'umd/semi-icons.min.js' : 'umd/semi-icons.js',
            path: path.join(__dirname, 'dist'),
            library: 'SemiIcons',
            libraryTarget: 'umd'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    include: [
                        path.resolve(__dirname, 'src'),
                    ],
                    use: [
                        {
                            loader: 'babel-loader',
                            options: babelConfig
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
                    test: /\.scss$/, 
                    loaders: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader'
                        },
                        {
                            loader: semiThemeLoader
                        }
                    ] 
                },
            ]
        },
        optimization: {
            minimize: !!minimize,
            minimizer: [new TerserPlugin()]
        },
        performance: { maxEntrypointSize: 10485760, maxAssetSize: 5242880 },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': { NODE_ENV: '"production"' }
            }),
            new CaseSensitivePathsPlugin(),
            new webpack.HashedModuleIdsPlugin(),
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: minimize ? 'css/semi-icons.min.css' : 'css/semi-icons.css',
            })
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
            }
        }
    };
};