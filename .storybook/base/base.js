
const path = require('path');
const _ = require('lodash');

function resolve(...dirs) {
    return path.join(__dirname, '../..', ...dirs);
}

module.exports = {
  "addons": [
    {
      name: "storybook-addon-turbo-build",
      options: {
        optimizationLevel: 3,
      },
    },
  ],
  webpackFinal: async (config) => {
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
    rules.unshift({
        test: /\.tsx/,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
        options: {
            loader: 'tsx',
            target: 'es2015'
        }
    });
    rules.unshift({
        test: /\.ts/,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
        options: {
            loader: 'ts',
            target: 'es2015'
        }
    });
    rules.push(
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
    );
    rules.push(
        {
            test: /\.s(a|c)ss$/,
            include: [resolve('packages/semi-ui'), resolve('packages/semi-foundation'), resolve('packages/semi-icons')],
            use: ['style-loader', 'css-loader', 'sass-loader', resolve('packages/semi-webpack/lib/semi-theme-loader.js')],
        }
    );
    config.module.rules = rules;
    config.resolve.extensions.push('.js', '.jsx', '.ts', '.tsx');
    config.resolve.symlinks = false;
    config.resolve.alias = {
        '@douyinfe/semi-foundation': resolve('packages/semi-foundation'),
        '@douyinfe/semi-icons': resolve('packages/semi-icons/src'),
        '@douyinfe/semi-ui': resolve('packages/semi-ui'),
        '@douyinfe/semi-theme-default': resolve('packages/semi-theme-default'),
        '@douyinfe/semi-illustrations': resolve('packages/semi-illustrations/src'),
        '@douyinfe/semi-animation': resolve('packages/semi-animation'),
        '@douyinfe/semi-animation-react': resolve('packages/semi-animation-react'),
        '@douyinfe/semi-animation-styled': resolve('packages/semi-animation-styled')
    };
    config.devtool = 'source-map';
    
    return config;
  }
};

