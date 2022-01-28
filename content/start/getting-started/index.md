---
category: 开始
title: Getting Started 快速开始
subTitle: 快速开始
localeCode: zh-CN
icon: doc-gettingstarted
order: 2
---

## 1、安装 Semi

```bash
# 使用 npm
npm i @douyinfe/semi-ui

# 使用 yarn
yarn add @douyinfe/semi-ui

# 使用 pnpm
pnpm add @douyinfe/semi-ui
```

## 2、模块化方式使用组件

在 Webpack、create-react-app 或 Vite 项目中使用时，无需进行任何编译项配置，直接使用即可。构建时所有相关资源均会按需打包。

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

> 推荐在项目中引入 [reset.css](https://www.npmjs.com/package/reset-css)，它可以避免引入浏览器自带的默认样式。

## 3、在 Next.js 中使用

当你在 Next.js 项目中使用时，需要搭配 Semi 提供的编译插件

### Step1

在项目根目录安装 `@douyinfe/semi-next` 。

```shell
# 使用 npm
npm i @douyinfe/semi-next --save-dev

# 使用 yarn
yarn add @douyinfe/semi-next --dev

# 使用 pnpm
pnpm add @douyinfe/semi-next --dev
```

### Step2

在项目根目录创建 `next.config.js`，并进行配置。

```js
// next.config.js
const semi = require('@douyinfe/semi-next').default({
    /* the extension options */
});
module.exports = semi({
    // your custom Next.js configuration
});
```

`@douyinfe/semi-next` 的 [详细文档](https://www.npmjs.com/package/@douyinfe/semi-next) 。

### Step3

在 `global.css` 中引入全量的 semi css。目前不支持按需引入。

```css
/* styles/globals.css */
@import '~@douyinfe/semi-ui/dist/css/semi.min.css';
```

**在 nextjs 中使用主题包**

请查阅 [此 issue](https://github.com/DouyinFE/semi-design/issues/565) 中的方法

## 4、UMD 方式使用组件

[![BUILD-JS][build-js-badge]][build-js-url] [![BUILD-CSS][build-css-badge]][build-css-url]

[build-js-badge]: https://img.badgesize.io/https:/unpkg.com/@douyinfe/semi-ui/dist/umd/semi-ui.min.js?label=semi.min.js&compression=gzip
[build-js-url]: https://unpkg.com/browse/@douyinfe/semi-ui/dist/umd/semi-ui.min.js
[build-css-badge]: https://img.badgesize.io/https:/unpkg.com/@douyinfe/semi-ui/dist/css/semi.min.css?label=semi.min.css&compression=gzip
[build-css-url]: https://unpkg.com/browse/@douyinfe/semi-ui/dist/css/semi.min.css

> 我们并不推荐直接使用已构建文件，这样会全量引入所有组件，无法实现按需加载。但如果确实有非构建场景的需求，可以通过以下方式引用

在浏览器中使用 script 和 link 标签直接引入文件，并使用全局变量 `SemiUI`、`SemiIcons`、`SemiIllustrations`

1、 请确保你已提前引入 react 以及 react-dom  
2、 引入 JS 文件，以下示例 URL 中 2.1.4 为 version 标识，希望使用不同版本 Semi 时，将 version 中对应的值替换即可  

| 资源 | URL |
| --- | --- |
| semi-ui (min) | https://unpkg.com/@douyinfe/semi-ui@2.1.4/dist/umd/semi-ui.min.js |
| semi-icons (min) | https://unpkg.com/@douyinfe/semi-icons@latest/dist/umd/semi-icons.min.js |
| semi-illustrations (min) | https://unpkg.com/@douyinfe/semi-illustrations@latest/dist/umd/semi-illustrations.min.js |
| semi-ui (normal) | https://unpkg.com/@douyinfe/semi-ui@2.1.4/dist/umd/semi-ui.js |
| semi-icons (normal) | https://unpkg.com/@douyinfe/semi-icons@latest/dist/umd/semi-icons.js |
| semi-illustrations (normal) | https://unpkg.com/@douyinfe/semi-illustrations@latest/dist/umd/semi-illustrations.js |

3、 引入 Semi 默认主题的 CSS 样式文件

| 资源 | URL |
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

+       <script src="https://unpkg.com/@douyinfe/semi-ui@2.1.4/dist/umd/semi-ui.min.js"></script>
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
            <Input defaultValue="semi" onChange={value => Toast.info('hello semi')}></Input>
            <IconHome size="large" />
            <IllustrationConstruction style={{ width: 150, height: 150 }} />
        </div>,
        document.getElementById('root')
    );
</script>
;
```
