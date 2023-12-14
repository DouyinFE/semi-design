const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeExternals = require('webpack-node-externals');

const commonComponent = [
    "base"
];

const buildCommonComponent = async ()=>{
    for (const component of commonComponent) {
        webpack({
            entry: path.resolve(path.join("./src", component, "index.ts")),
            mode: "production",
            target: ['web', 'es2020'],
            resolve: {
                extensions: ['.ts', '.scss']
            },
            output: {
                path: path.resolve(path.join("lib", component)),
                filename: 'index.js',
                library: component,
                chunkFormat: 'module'
            },
            optimization: {
                minimize: false
            },
            module: {
                rules: [
                    {
                        test: /\.ts/,
                        loader: "esbuild-loader",
                        exclude: /node_modules/,
                    },
                    {
                        test: /\.s?[ac]ss$/i,
                        use: [
                            MiniCssExtractPlugin.loader,
                            "css-loader",
                            "sass-loader"
                        ]
                    }
                ]
            },
            externals: [
                /.css/,
                nodeExternals()
            ],
            plugins: [
                new MiniCssExtractPlugin()
            ]
        }, (err, stats)=>{
            if (err) {
                console.log(err);
            }
            if (stats?.hasErrors()) {
                console.log(stats.compilation.errors);
            }

        });

    }
};

buildCommonComponent();