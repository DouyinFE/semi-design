---
category: Getting Started
title: Quick Start
subTitle: Quick Start
icon: doc-gettingstarted
localeCode: en-US
order: 2
---

## 1. Installation of Semi

```bash
# with npm
npm i @douyinfe/semi-ui

# with yarn
yarn add @douyinfe/semi-ui

# with pnpm
pnpm add @douyinfe/semi-ui
```
## 2、Use components in a modular way 💫

```jsx
import React, { Component } from 'react';
import { Button, Toast } from '@douyinfe/semi-ui';

class Demo extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <Button onClick={() => Toast.warning({ content: 'welcome' })}>Hello Semi</Button>;
    }
}
```

> It is recommended to introduce [reset.css](https://www.npmjs.com/package/reset-css) into the project, which can avoid introducing the default style of the browser.

## Use UMD import in browser

[![BUILD-JS][build-js-badge]][build-js-url] [![BUILD-CSS][build-css-badge]][build-css-url]

[build-js-badge]: https://img.badgesize.io/https:/unpkg.com/@douyinfe/semi-ui/dist/umd/semi-ui.min.js?label=semi.min.js&compression=gzip
[build-js-url]: https://unpkg.com/browse/@douyinfe/semi-ui/dist/umd/semi-ui.min.js
[build-css-badge]: https://img.badgesize.io/https:/unpkg.com/@douyinfe/semi-ui/dist/css/semi.min.css?label=semi.min.css&compression=gzip
[build-css-url]: https://unpkg.com/browse/@douyinfe/semi-ui/dist/css/semi.min.css

> We do not recommend using the built file directly, as this will introduce all components in full and cannot be loaded on demand. But if there is indeed a need for non-construction scenarios, you can quote in the following ways

Use script and link tags to import files directly in the browser, and use the global variable `SemiUI`、`SemiIcons`、`SemiIllustrations`

1. Please make sure you have import `react` and `react-dom` in advance
2. Import the JS file, the following example URL 2.1.4 is the version identifier, if you want to use a different version of Semi, just replace the corresponding value in version

| Resource | URL |
| --- | --- |
| semi-ui (min) | https://unpkg.com/@douyinfe/semi-ui@2.1.4/dist/umd/semi-ui.min.js |
| semi-icons (min) | https://unpkg.com/@douyinfe/semi-icons@latest/dist/umd/semi-icons.min.js |
| semi-illustrations (min) | https://unpkg.com/@douyinfe/semi-illustrations@latest/dist/umd/semi-illustrations.min.js |
| semi-ui (normal) | https://unpkg.com/@douyinfe/semi-ui@2.1.4/dist/umd/semi-ui.js |
| semi-icons (normal) | https://unpkg.com/@douyinfe/semi-icons@latest/dist/umd/semi-icons.js |
| semi-illustrations (normal) | https://unpkg.com/@douyinfe/semi-illustrations@latest/dist/umd/semi-illustrations.js |

3. Import the CSS style file of the Semi default theme

| Resource | URL |
| --- | --- |
| semi.css | https://unpkg.com/@douyinfe/semi-ui@2.1.4/dist/css/semi.css |
| semi-icons.css | https://unpkg.com/@douyinfe/semi-icons@latest/dist/css/semi-icons.css |

```diff
<!DOCTYPE html>
    <html lang="zh-cn">
    <head>
        <script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
+       <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
+       <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>

+       <script src="https://unpkg.com/@douyinfe/semi-ui@2.1.4/dist/umd/semi-ui-react.min.js"></script>
+       <link rel="stylesheet" href="https://unpkg.com/@douyinfe/semi-ui@2.1.4/dist/css/semi.css">

+       <script src="https://unpkg.com/@douyinfe/semi-icons@latest/dist/umd/semi-icons.min.js"></script>
+       <link rel="stylesheet" href="https://unpkg.com/@douyinfe/semi-icons@latest/dist/css/semi-icons.css">
+       <script src="https://unpkg.com/@douyinfe/semi-illustrations@latest/dist/umd/semi-illustrations.min.js"></script>

    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
```

```html
<script type="text/babel">
    const { Input, Button, Toast, Icon, Form } = SemiUI;
    const { IconHome } = SemiIcons;
    const { IllustrationConstruction } = SemiIllustrations;
    ReactDOM.render(
    <div>
        <Button onClick={() => Toast.warning({ duration: 0, content: 'Semi Design' })}>test</Button>
        <Input defaultValue="semi" onChange={value => Toast.info('abc')}></Input>
        <IconHome size="large" />
        <IllustrationConstruction style={{width: 150, height: 150}} />
    </div>, document.getElementById("root"));
</script>
```

## 4、Use in Next.js

### Step1

Install `@douyinfe/semi-next` in the project root directory.

``` shell
# with npm
npm i @douyinfe/semi-next --save-dev

# with yarn
yarn add @douyinfe/semi-next --dev

# with pnpm
pnpm add @douyinfe/semi-next --dev

```

### Step2

Create `next.config.js` in the project root directory and configure it.

```js
// next.config.js
const semi = require('@douyinfe/semi-next').default({/* the extension options */});
module.exports = semi({
    // your custom Next.js configuration
});
```

[Detailed documentation]() of `@douyinfe/semi-next`.

### Step3

Introduce the full amount of semi css in `global.css`. Currently, on-demand introduction is not supported.

``` css
/* styles/globals.css */
@import '~@douyinfe/semi-ui/dist/css/semi.min.css';

```
