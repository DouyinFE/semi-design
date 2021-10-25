// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.
const path = require('path');
const _ = require('lodash');
const SemiWebpackPlugin = require('../../packages/semi-ui-plugin-core');

function resolve(...dirs) {
    return path.join(__dirname, '../..', ...dirs);
}

module.exports = ({ config }) => {
    const rules =
        (config.module.rules &&
            config.module.rules.filter(rule => {
                const test = _.toString(rule && rule.test);
                if (/\.css/i.test(test) || /\.s(c|a)ss/i.test(test)) {
                    return false;
                }
                return true;
            })) ||
        [];
    rules.push(
        {
            test: /\.css$/,
            loaders: ['style-loader', 'css-loader'],
        },
        {
            test: /\.tsx?$/,
            use: [
                {
                    loader: require.resolve('awesome-typescript-loader'),
                },
            ],
        },
        {
            test: /\.svg?$/,
            use: ['@svgr/webpack']
        }
    );
    config.module.rules = rules;
    config.resolve.extensions.push('.js', '.jsx', '.ts', '.tsx');
    config.resolve.symlinks = false;
    config.resolve.alias = {
        '@douyinfe/semi-foundation': resolve('packages/semi-foundation'),
        '@douyinfe/semi-ui': resolve('packages/semi-ui'),
        '@douyinfe/semi-icons': resolve('packages/semi-icons/src'),
        '@douyinfe/semi-theme-default': resolve('packages/semi-theme-default'),
        '@douyinfe/semi-illustrations': resolve('packages/semi-illustrations/src'),
    };
    config.devtool = 'source-map';
    // config.devtool = 'cheap-source-map';
    config.plugins.push(
        new SemiWebpackPlugin({
            theme: '@douyinfe/semi-theme-default',
            esbuild: true,
            paths: [
                function check(path) {
                    return (
                        (/packages\/semi-foundation/i.test(path) ||
                            /packages\/semi-ui/i.test(path) ||
                            /packages\/semi-icons/i.test(path)) &&
                        !(
                            /packages\/semi-foundation\/node_modules/i.test(path) ||
                            /packages\/semi-ui\/node_modules/i.test(path)
                        )
                    );
                },
            ],
            scssPaths: [
                resolve('packages/semi-foundation'),
                resolve('packages/semi-ui'),
                resolve('packages/semi-theme-default'),
            ],
        })
    );
    return config;
};
