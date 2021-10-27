> A webpack plugin for SemiDesign to custom theme、replace prefix and so on.

## Introduction
The plugin is designed for SemiDesign, support webpack4 and webpack5, provides two major abilities:
- Custom theme
- Replace prefix of css selector 

## Usage 

### Install 
Install `@douyinfe/semi-webpack-plugin` as a development dependency:

``` shell
npm install --save-dev @douyinfe/semi-webpack-plugin
# or
yarn add --dev @douyinfe/semi-webpack-plugin
```

### Custom theme
SemiDesign uses the scss variables to extract thousands of Design Tokens. You can replace Token through this plugin to achieve theme customization. [More info](https://semi.design/dsm/)

You can custom theme through three ways:
- NPM package for custom theme
- Local scss file in your project
- Pass key-value pair parameters to plugin 
Priority from low to high.
#### Through NPM package 

In order to use the NPM package, you need to customize the theme through [Semi Design System](https://semi.design/dsm/).After finishing the customization, Semi DSM will generate an NPM package for you, and then you can use it like this.

``` js
// webpack.config.js
const SemiPlugin = require('@douyinfe/semi-webpack-plugin').default;

module.exports = {
    // ...
    plugins: [
        new SemiPlugin({
            theme: '@douyinfe/semi-theme-default'
        })
    ]
    // ...
};
```

#### Through local scss file

You can check which tokens can be customized on the [Semi WebSite](https://semi.design/zh-CN/basic/tokens).

- step1: add a local file
``` scss
// local.scss
$font-size-small: 16px;

```
- step2: config webpack
``` js
// webpack.config.js
const path = require('path');
const SemiPlugin = require('@douyinfe/semi-webpack-plugin').default;

module.exports = {
    // ...
    plugins: [
        new SemiPlugin({
            include: path.join(__dirname, 'local.scss')
        })
    ]
};
```

#### Through parameters
``` js
// webpack.config.js
const SemiPlugin = require('@douyinfe/semi-webpack-plugin').default;

module.exports = {
    // ...
    plugins: [
        new SemiPlugin({
            variables: {
                "$font-size-small": '16px'
            }
        })
    ]
};
```

### Replace prefix of css selector
The css selectors used by SemiDesign is prefixed with semi by default(e.g, `.semi-button`).You can replace the prefix through this plugin.

``` js
// webpack.config.js
const SemiPlugin = require('@douyinfe/semi-webpack-plugin').default;

module.exports = {
    // ...
    plugins: [
        new SemiPlugin({
            prefixCls: 'custom'
        })
    ]
    // ...
};
```

Then you get the replaced css selectors(e.g, `.custom-button`).

## Api
### new SemiPlugin(options)

#### options.prefixCls

Type: `String`

The prefix of css selector.

#### options.theme

Type: `String` or `Object`

When the type is string, it represents the name of NPM for custom theme.You can use [Semi Design System](https://semi.design) to custom theme.

##### options.theme.name

Same performance as when the type of `options.theme` is string.

##### options.include

Type: `String`

The absolute path of the local scss file.

##### options.variables

Type: `Object`

The key-value pair of scss token.
