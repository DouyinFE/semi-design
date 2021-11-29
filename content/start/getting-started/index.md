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

## 3、UMD 方式使用组件

> 我们并不推荐直接使用已构建文件，这样会全量引入所有组件，无法实现按需加载。但如果确实有非构建场景的需求，可以通过以下方式引用

在浏览器中使用 script 和 link 标签直接引入文件，并使用全局变量 `SemiUI`、`SemiIcons`、`SemiIllustrations`

1. 请确保你已提前引入 react 以及 react-dom
2. 引入 JS 文件，以下示例 URL 中 2.0.0 为 version 标识，希望使用不同版本 Semi 时，将 version 中对应的值替换即可（注意构建文件仅在 v1.3.0 后开始提供）
    - semi-ui min：`https://unpkg.com/@douyinfe/semi-ui@2.0.0/dist/umd/semi-ui.min.js`
    - semi-ui normal: `https://unpkg.com/@douyinfe/semi-ui@2.0.0/dist/umd/semi-ui.js`

    - semi-icons min: `https://unpkg.com/@douyinfe/semi-icons@latest/dist/umd/semi-icons.min.js`
    - semi-icons normal: `https://unpkg.com/@douyinfe/semi-icons@latest/dist/umd/semi-icons.js`

    - semi-illustrations min: `https://unpkg.com/@douyinfe/semi-illustrations@latest/dist/umd/semi-illustrations.min.js`
    - semi-illustrations normal: `https://unpkg.com/@douyinfe/semi-illustrations@latest/dist/umd/semi-illustrations.js`
3. 引入 Semi 默认主题的 CSS 样式文件  
    - `https://unpkg.com/@douyinfe/semi-ui@2.0.0/dist/css/semi.css`
    - `https://unpkg.com/@douyinfe/semi-icons@latest/dist/css/semi-icons.css`

```diff
<!DOCTYPE html>
    <html lang="zh-cn">
    <head>
        <script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
+       <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
+       <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>

+       <script src="https://unpkg.com/@douyinfe/semi-ui@2.0.0/dist/umd/semi-ui.min.js"></script>
+       <link rel="stylesheet" href="https://unpkg.com/@douyinfe/semi-ui@2.0.0/dist/css/semi.css">

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
        <IllustrationConstruction style={{width: 150, height: 150}} />
    </div>, document.getElementById("root"));
</script>
```