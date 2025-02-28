# `semi-vite`

> A Vite plugin for Semi Design to custom theme、replace prefix and so on.

## Introduction
The plugin is designed for Semi Design, provides two major abilities:
- Custom theme
- Replace prefix of CSS selector 

## Usage 

### Install 
Install `@douyinfe/semi-vite-plugin` as a development dependency:

```shell
npm install --save-dev @douyinfe/semi-vite-plugin
# or
yarn add --dev @douyinfe/semi-vite-plugin
```

### Custom theme
Semi Design uses the Scss variables to extract thousands of Design Tokens. You can replace Token through this plugin to achieve theme customization. [More info](https://semi.design/dsm/)

You can custom theme through three ways:
- npm package for custom theme
- Local Scss file in your project
- Pass key-value pair parameters to plugin 
Priority from low to high.

#### Through npm package 

In order to use the npm package, you need to customize the theme through [Semi Design System](https://semi.design/dsm/). After finishing the customization, Semi DSM will generate a npm package for you, and then you can use it like this.

```js
// vite.config.js
import { semiPlugin } from '@douyinfe/semi-vite-plugin';

export default {
    plugins: [
        semiPlugin({
            theme: '@douyinfe/semi-theme-default'
        })
    ]
};
```

#### Through local Scss file

You can check which tokens can be customized on the [Semi WebSite](https://semi.design/en-US/basic/tokens).

- step1: add a local file
```scss
// local.scss
$font-size-small: 16px;
```

- step2: config vite
```js
// vite.config.js
import { semiPlugin } from '@douyinfe/semi-vite-plugin';
import path from 'path';

export default {
    plugins: [
        semiPlugin({
            include: path.join(__dirname, 'local.scss')
        })
    ]
};
```

#### Through parameters
```js
// vite.config.js
import { semiPlugin } from '@douyinfe/semi-vite-plugin';

export default {
    plugins: [
        semiPlugin({
            variables: {
                "$font-size-small": '16px'
            }
        })
    ]
};
```

### Replace prefix of CSS selector
The CSS selectors used by Semi Design is prefixed with semi by default(e.g, `.semi-button`). You can replace the prefix through this plugin.

```js
// vite.config.js
import { semiPlugin } from '@douyinfe/semi-vite-plugin';

export default {
    plugins: [
        semiPlugin({
            prefixCls: 'custom'
        })
    ]
};
```

Then you get the replaced CSS selectors(e.g, `.custom-button`).

## Api
### semiPlugin(options)

#### options.prefixCls

Type: `String`

The prefix of CSS selector.

#### options.theme

Type: `String` or `Object`

When the type is string, it represents the name of npm for custom theme. You can use [Semi Design System](https://semi.design) to custom theme.

##### options.theme.name

Same performance as when the type of `options.theme` is string.

##### options.include

Type: `String`

The absolute path of the local Scss file.

##### options.variables

Type: `Object`

The key-value pair of Scss token.

##### options.preprocessOptions

Type: `Object`

Additional options to pass to the Sass preprocessor.

```
const semiVite = require('semi-vite');

// TODO: DEMONSTRATE API
```
