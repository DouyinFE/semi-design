import path from 'path';
import webpack from 'webpack';

function resolve(dir) {
    return path.join(__dirname, dir);
}

const config = {
    resolve: {
        alias: {
            '@douyinfe/semi-foundation': resolve('packages/semi-foundation'),
            '@douyinfe/semi-icons': resolve('packages/semi-icons/src'),
            '@douyinfe/semi-ui': resolve('packages/semi-ui'),
            '@douyinfe/semi-theme-default': resolve('packages/semi-theme-default'),
            '@douyinfe/semi-illustrations': resolve('packages/semi-illustrations/src'),
            '@douyinfe/semi-animation': resolve('packages/semi-animation'),
            '@douyinfe/semi-animation-react': resolve('packages/semi-animation-react'),
            '@douyinfe/semi-animation-styled': resolve('packages/semi-animation-styled'),
        },
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.s(a|c)ss$/,
                include: [
                    resolve('packages/semi-ui'),
                    resolve('packages/semi-foundation'),
                    resolve('packages/semi-icons'),
                ],
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                    resolve('packages/semi-webpack/lib/semi-theme-loader.js'),
                ],
            },
            {
                test: /\.[jt]sx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
};

export default config;
