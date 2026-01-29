---
category: 开始
title: Getting Started 快速开始
subTitle: 快速开始
localeCode: zh-CN
icon: doc-gettingstarted
order: 2
---

Semi Design 由抖音前端团队负责维护，提供 React 版本开箱即用的70+ 组件、 Figam Variant UI Kit  
你可在任意 React 项目中引入使用 （新项目更推荐通过 Rsbuild、CreateReactApp、Vite 新建），当前支持搭配 React v16、v17、v18 、v19（[React v19 适配](/zh-CN/start/react19)）版本使用  

若你需要使用 prefixCls、主题、CSS Layer等编译时定制能力的场景，我们更推荐使用 Webpack 或 Rspack/Rsbuild 作为工程化构建方案  
（字节跳动用户，若使用的是公司内部相关工程化方案，配置请查阅飞书文档：<a href="https://bytedance.larkoffice.com/wiki/FaRwweDLmigrD0k8wLgcDaQtnbb" target="_blank">Semi工程化 FAQ</a>）

<Notice title='注意事项'>
组件包 @douyinfe/semi-ui 适用于 React 版本低于 v19 的情况，如果使用 React v19，请使用 @douyinfe/semi-ui-19，下文中所有示例中的 @douyinfe/semi-ui 均可替换为 @douyinfe/semi-ui-19。
</Notice>

## 1、安装 Semi

以下展示了 `@douyinfe/semi-ui` 的安装和使用

```bash
# 使用 npm
npm i @douyinfe/semi-ui

# 使用 yarn
yarn add @douyinfe/semi-ui

# 使用 pnpm
pnpm add @douyinfe/semi-ui
```

## 2、使用组件

在 Webpack、Rspack、create-react-app 或 Vite 项目中使用时，无需进行任何编译项配置，直接使用即可。构建时所有相关资源均会按需打包    

```jsx
import React, { Component } from 'react';
// 如果为 React v19，需要从 @douyinfe/semi-ui-19 中导出组件
import { Button, Toast } from '@douyinfe/semi-ui';

const SemiApp = () => {
    return (
        <Button onClick={() => Toast.warning({ content: 'welcome' })}>Hello Semi</Button>
    );
};
```

> 推荐在项目中引入 [reset.css](https://www.npmjs.com/package/reset-css)，它可以重置浏览器自带的默认样式，避免不同UA之间的样式差异。

## 3、在 NextJs 中使用

<Notice>
    注意：以下配置适用于 React18及以下版本。Next15默认使用React19，目前Semi尚未实现React19的兼容性适配，如果使用Next15请将React版本降级为18或以下版本。
</Notice>

- Node 版本要求 >= v22.12.0
- 如果仅使用默认主题, 在 `transpilePackages` 追加 Semi 相关的 package即可 （Next.js 版本要求 >= v13.1 ）
```diff
// next.config.js
const nextConfig = {
+ transpilePackages: ['@douyinfe/semi-ui', '@douyinfe/semi-icons', '@douyinfe/semi-illustrations'],
};

module.exports = nextConfig;
```


- 如果需要使用定制主题包或 Next.js版本低于 v13.1，则需要配合 Semi 提供的编译插件 `@douyinfe/semi-next` 插件使用 
  - 首先安装插件 `npm i @douyinfe/semi-next` (如果你使用 yarn 或 pnpm，请自行更换为对等命令)
  - 在 next.config.js 中进行配置，插件会将组件默认的import CSS 语句移除。更多配置可查阅 `@douyinfe/semi-next`[详细文档](https://www.npmjs.com/package/@douyinfe/semi-next) 
  - 在 `global.css` 中引入全量的 semi css（目前在 Next.js 中不支持按需引入）
```js
// next.config.js
const semi = require('@douyinfe/semi-next').default({
    /* the extension options */
});
module.exports = semi({
    // your custom Next.js configuration
});
```

```css
/* styles/globals.css */
@import '~@douyinfe/semi-ui/dist/css/semi.min.css';
```

**如何在 Next.js 中使用主题包**  
你需要更换 globals.css 中 import 语句的路径，将默认主题 CSS 产物更换为你定制的主题包中的 CSS 产物，例如当希望应用抖音创作服务平台的主题包 `@semi-bot/semi-theme-doucreator` 时
```css
/* styles/globals.css */
@import '~@semi-bot/semi-theme-doucreator/semi.min.css';
```

## 4、在 Remix 中使用
<Notice>
    注意：以下配置适用于 Remix v2 + Vite构建模式。
</Notice>

- 如果使用默认主题，参考如下vite配置
```diff
// vite.config.ts
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
+      "date-fns-tz": path.resolve(
+        __dirname,
+        "node_modules/date-fns-tz/esm/index.js"
+      ),
    },
  },
  ssr: {
    noExternal: [
+      "@douyinfe/semi-ui",
+     "@douyinfe/semi-foundation",
+      "@douyinfe/semi-illustrations",
+      "@douyinfe/semi-icons",
+      "scroll-into-view-if-needed",
    ],
  },
  plugins: [
    remix({
+      future: {
+        v3_fetcherPersist: true,
+        v3_relativeSplatPath: true,
+        v3_throwAbortReason: true,
+      },
    }),
    tsconfigPaths(),
  ],
});
```
- 完成配置，可以正常使用 Semi 相关组件 

**如何在 Remix 中使用主题包**  
- 首先安装插件 npm i vite-plugin-semi (如果你使用 yarn 或 pnpm，请自行更换为对等命令)
- 在 vite.config.js 中进行配置

```diff
/* vite.config.ts */
+ import semi from "vite-plugin-semi-theme";
export default defineConfig({

  plugins: [
+    semi({
+      theme: '@semi-bot/semi-theme-jianying',
+    }),
  ],
});
```
- 在 root.tsx中引入主题包
```diff
// root.tsx
+ import ThemeStyle from "@semi-bot/semi-theme-jianying/semi.min.css?url";

export const links: LinksFunction = () => [
  {
+    rel: "stylesheet",
+    href: ThemeStyle,
  },
];
```
## 5、UMD 方式使用组件

[![BUILD-JS][build-js-badge]][build-js-url] [![BUILD-CSS][build-css-badge]][build-css-url]

[build-js-badge]: https://img.badgesize.io/https:/unpkg.com/@douyinfe/semi-ui/dist/umd/semi-ui.min.js?label=semi.min.js&compression=gzip
[build-js-url]: https://unpkg.com/browse/@douyinfe/semi-ui/dist/umd/semi-ui.min.js
[build-css-badge]: https://img.badgesize.io/https:/unpkg.com/@douyinfe/semi-ui/dist/css/semi.min.css?label=semi.min.css&compression=gzip
[build-css-url]: https://unpkg.com/browse/@douyinfe/semi-ui/dist/css/semi.min.css

> 我们并不推荐直接使用已构建文件，这样会全量引入所有组件，无法实现按需加载。但如果确实有非构建场景的需求，可以通过以下方式引用

在浏览器中使用 script 和 link 标签直接引入文件，并使用全局变量 `SemiUI`、`SemiIcons`、`SemiIllustrations`

1、 请确保你已提前引入 react 以及 react-dom  
2、 引入 JS 文件，以下示例 URL 中 2.27.0 为 version 标识，希望使用不同版本 Semi 时，将 version 中对应的值替换即可  

| 资源 | URL |
| --- | --- |
| semi-ui (min) | https://unpkg.com/@douyinfe/semi-ui@2.27.0/dist/umd/semi-ui.min.js |
| semi-icons (min) | https://unpkg.com/@douyinfe/semi-icons@latest/dist/umd/semi-icons.min.js |
| semi-illustrations (min) | https://unpkg.com/@douyinfe/semi-illustrations@latest/dist/umd/semi-illustrations.min.js |
| semi-ui (normal) | https://unpkg.com/@douyinfe/semi-ui@2.27.0/dist/umd/semi-ui.js |
| semi-icons (normal) | https://unpkg.com/@douyinfe/semi-icons@latest/dist/umd/semi-icons.js |
| semi-illustrations (normal) | https://unpkg.com/@douyinfe/semi-illustrations@latest/dist/umd/semi-illustrations.js |

3、 引入 Semi 默认主题的 CSS 样式文件

| 资源 | URL |
| --- | --- |
| semi.css | https://unpkg.com/@douyinfe/semi-ui@2.27.0/dist/css/semi.css |
| semi-icons.css | https://unpkg.com/@douyinfe/semi-icons@latest/dist/css/semi-icons.css |

```diff
<!DOCTYPE html>
    <html lang="zh-cn">
    <head>
        <script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
+       <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
+       <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>

+       <script src="https://unpkg.com/@douyinfe/semi-ui@2.27.0/dist/umd/semi-ui.min.js"></script>
+       <link rel="stylesheet" href="https://unpkg.com/@douyinfe/semi-ui@2.27.0/dist/css/semi.css">

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
