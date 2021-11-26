const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const babelConfig = require('./babel.config');

module.exports = function getWebpackConfig({ minimize }){
    return {
        mode: 'production',
        bail: true,
        devtool: 'source-map',
        entry: {
            index: ['./src/index.ts']
        },
        output: {
            filename: minimize ? 'umd/semi-illustrations.min.js' : 'umd/semi-illustrations.js',
            path: path.join(__dirname, 'dist'),
            library: 'SemiIllustrations',
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
                }
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